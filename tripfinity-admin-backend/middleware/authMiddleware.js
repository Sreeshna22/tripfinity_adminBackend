const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

const adminChecker = (req, res, next) => {
  if (req.user?.role === "admin") next();
  else return res.status(401).json({ msg: "Unauthorized" });
};

module.exports = { authMiddleware, adminChecker };