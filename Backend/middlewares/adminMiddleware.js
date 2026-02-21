// middlewares/adminMiddleware.js
const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).send("Access Denied. No token provided.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin)
      return res.status(403).send("Access Denied. Admins only.");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Invalid or expired token.");
  }
};

module.exports = adminMiddleware;
