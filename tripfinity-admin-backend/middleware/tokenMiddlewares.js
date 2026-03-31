






const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  const token = req.cookies?.admin_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid or expired" });
  }
};


const adminChecker = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
   
    return res.status(403).json({ msg: "Access denied: Admin only" });
  }
};


const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const generateResetToken = (userId) => {
  return jwt.sign(
    { userId, purpose: "password_reset" }, 
    process.env.JWT_SECRET, 
    { expiresIn: "10m" } 
  );
};


module.exports = { 
  authMiddleware, 
  adminChecker, 
  generateAccessToken, 
  generateRefreshToken, 
  generateResetToken 
};