const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // Password strength validation
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

if (!passwordRegex.test(password)) {
  return res.status(400).json({
    success: false,
    message:
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
  });
}

    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users
      (full_name, email, password_hash)
      VALUES (?, ?, ?)`,
      [full_name, email, password_hash]
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const user = users[0];

    // Check if account is locked
if (user.locked_until && new Date(user.locked_until) > new Date()) {
  return res.status(423).json({
    success: false,
    message: "Account is locked. Try again after 15 minutes.",
  });
}

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
  const attempts = user.failed_attempts + 1;

  // Lock account after 5 failed attempts
  if (attempts >= 5) {
    const lockedUntil = new Date(Date.now() + 15 * 60 * 1000);

    await db.query(
      `
      UPDATE users
      SET failed_attempts = ?, locked_until = ?
      WHERE id = ?
      `,
      [attempts, lockedUntil, user.id]
    );

    return res.status(423).json({
      success: false,
      message:
        "Account locked due to 5 failed login attempts. Try again after 15 minutes.",
    });
  }

  await db.query(
    `
    UPDATE users
    SET failed_attempts = ?
    WHERE id = ?
    `,
    [attempts, user.id]
  );

  return res.status(401).json({
    success: false,
    message: `Invalid Email or Password. ${5 - attempts} attempt(s) remaining.`,
  });
}

await db.query(
  `
  UPDATE users
  SET failed_attempts = 0,
      locked_until = NULL
  WHERE id = ?
  `,
  [user.id]
);

    // Generate Access Token (15 minutes)
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // Generate Refresh Token (1 hour)
    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        profile_image: user.profile_image,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // Generate new access token
    const accessToken = jwt.sign(
      {
        id: decoded.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({
      success: true,
      accessToken,
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please log in again.",
    });
  }
};