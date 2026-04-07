// middlewares/adminMiddleware.js
const jwt = require("jsonwebtoken");

// Admin Middleware
const adminMiddleware = (req, res, next) => {
  try {
    // Get the Authorization header (support both 'Authorization' and lowercase) //
    const authHeader =
      req.header("Authorization") || req.header("authorization");
    // Check if the Authorization header is present or not //
    if (!authHeader)
      return res.status(401).send("Access Denied. No token provided.");

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    if (!token)
      return res.status(401).send("Access Denied!, No token provided.");
    // Verify the token and check if the user is an admin //
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Check if the user has admin privileges //
      if (!decoded.isAdmin)
        return res.status(403).send("Access Denied!, Admins only.");
      // Attach the decoded token to the request object for further use //
      req.user = decoded;
      next();
    } catch (jwtError) {
      return res.status(401).send("Invalid or Expired token..");
    }
  } catch (err) {
    res.status(500).send("Internal Server Error :( Please try again later.");
  }
};

module.exports = adminMiddleware;
