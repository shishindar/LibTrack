const jwt = require('jsonwebtoken');

/**
 * requireAuth — verifies the Bearer token on the Authorization header.
 * On success, attaches { id, email, role } to req.user.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'Missing or malformed Authorization header' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError'
      ? 'Session expired, please log in again'
      : 'Invalid or expired token';
    return res.status(401).json({ success: false, message });
  }
}

/**
 * requireRole(...roles) — use after requireAuth to restrict an endpoint
 * to specific roles, e.g. requireRole('admin').
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
