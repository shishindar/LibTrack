const xss = require("xss");

function sanitize(req, res, next) {
  // Recursively sanitize objects
  const clean = (obj) => {
    if (typeof obj === "string") {
      return xss(obj.trim());
    }

    if (Array.isArray(obj)) {
      return obj.map(clean);
    }

    if (obj && typeof obj === "object") {
      const sanitized = {};

      for (const key in obj) {
        sanitized[key] = clean(obj[key]);
      }

      return sanitized;
    }

    return obj;
  };

  req.body = clean(req.body);
  req.query = clean(req.query);
  req.params = clean(req.params);

  next();
}

module.exports = sanitize;