// ============================================
// FILE: backend/middleware/authMiddleware.js
// PURPOSE: Protect admin-only routes
// This runs BEFORE the actual route handler
// If no valid token → access denied
// If valid token → allow access, pass to next()
// ============================================

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // Step 1: Get the token from the request headers
  // Frontend sends token in "Authorization: Bearer <token>" format
  const authHeader = req.headers.authorization;

  // Step 2: Check if token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  // Step 3: Extract just the token part (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  try {
    // Step 4: Verify the token using our secret key from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 5: Attach admin info to the request object
    // This makes req.admin available in all protected route handlers
    req.admin = decoded;

    // Step 6: Call next() to proceed to the actual route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

module.exports = { protect };