const db = require("../config/db");
const fs = require("fs");
const path = require("path");

exports.removeProfilePicture = async (req, res) => {
  try {
    const [users] = await db.query(
      `
      SELECT profile_image
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const image = users[0].profile_image;

    if (image) {
      const imagePath = path.join(__dirname, "..", image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await db.query(
      `
      UPDATE users
      SET profile_image = NULL
      WHERE id = ?
      `,
      [req.user.id]
    );

    const [updated] = await db.query(
      `
      SELECT id, full_name, email, profile_image
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    res.json({
      success: true,
      message: "Profile picture removed successfully.",
      data: updated[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      `
      SELECT id, full_name, email, profile_image
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: users[0],
    });

  } catch (error) {
  console.error("GET PROFILE ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { full_name } = req.body;

    if (!full_name || full_name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 3 characters.",
      });
    }

    await db.query(
      `
      UPDATE users
      SET full_name = ?
      WHERE id = ?
      `,
      [full_name.trim(), req.user.id]
    );

    const [users] = await db.query(
      `
      SELECT id, full_name, email, profile_image
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    res.json({
      success: true,
      message: "Profile updated successfully.",
      data: users[0],
    });

  } catch (error) {
  console.error("PROFILE UPDATE ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

const bcrypt = require("bcryptjs");

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const {
      current_password,
      new_password,
      confirm_password,
    } = req.body;

    // Check required fields
    if (
      !current_password ||
      !new_password ||
      !confirm_password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Confirm passwords match
    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // Password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!passwordRegex.test(new_password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      });
    }

    // Get current user
    const [users] = await db.query(
      `
      SELECT password_hash
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(
      current_password,
      users[0].password_hash
    );

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    // Prevent same password
    const samePassword = await bcrypt.compare(
      new_password,
      users[0].password_hash
    );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password cannot be the same as the current password.",
      });
    }

    // Hash new password
    const password_hash = await bcrypt.hash(
      new_password,
      10
    );

    // Update password
    await db.query(
      `
      UPDATE users
      SET password_hash = ?
      WHERE id = ?
      `,
      [password_hash, req.user.id]
    );

    res.json({
      success: true,
      message: "Password updated successfully.",
    });

  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Upload Profile Picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const imagePath = `/uploads/profiles/${req.file.filename}`;

    await db.query(
      `
      UPDATE users
      SET profile_image = ?
      WHERE id = ?
      `,
      [imagePath, req.user.id]
    );

    const [users] = await db.query(
      `
      SELECT id, full_name, email, profile_image
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    res.json({
      success: true,
      message: "Profile picture updated successfully.",
      data: users[0],
    });

  } catch (error) {
    console.error("PROFILE PHOTO ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};