//Importing jsonwebtoken package
const jwt = require("jsonwebtoken");

//Auth Middleware
module.exports = function (req, res, next) {
  try {
    // Get the Authorization header (support both 'Authorization' and lowercase)
    const authHeader =
      req.header("Authorization") || req.header("authorization");
    if (!authHeader)
      return res.status(401).send("Access denied. No token found.");

    // Support 'Bearer <token>' or raw token value
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    if (!token) return res.status(401).send("Access denied. No token found.");

    // Verify the token and attach the payload as `req.user`
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).send("Invalid or expired token.");
  }
};
