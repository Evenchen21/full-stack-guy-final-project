// middlewares/adminMiddleware.js
const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  try {
    const authHeader =
      req.header("Authorization") || req.header("authorization");

    if (!authHeader)
      return res.status(401).send("Access Denied. No token provided.");

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    if (!token)
      return res.status(401).send("Access Denied. No token provided.");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.isAdmin)
        return res.status(403).send("Access Denied. Admins only.");

      req.user = decoded;
      next();
    } catch (jwtError) {
      return res.status(401).send("Invalid or expired token.");
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = adminMiddleware;
