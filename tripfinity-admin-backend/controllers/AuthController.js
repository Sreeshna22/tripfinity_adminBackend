







const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OtpModel = require("../models/OtpModel");
const sendEmail = require("../utils/sendEmail");

const { 
  generateAccessToken, 
  generateRefreshToken, 
  generateResetToken 
} = require("../middleware/tokenMiddlewares");

const authCtrl = {};


const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

authCtrl.AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    if (!email && !password) {
      return res.status(400).json({ msg: "Email and Password are required" });
    }

  
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    
    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    
    if (!validateEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

  

    const user = await User.findOne({ email: email.toLowerCase(), role: "admin" });
    
    
    if (!user) return res.status(401).json({ msg: "Admin account not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Wrong password" });

    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id, role: user.role });

    res.cookie('admin_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 
    });

    return res.json({ accessToken, refreshToken, msg: "Login successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server Error" });
  }
};


authCtrl.sendOTPForgotPwd = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OtpModel.deleteMany({ email });
    await OtpModel.create({ email, otp });

    await sendEmail(email, otp);
    res.json({ msg: "OTP sent" });
  } catch (err) {
    res.status(500).json({ msg: "Error sending OTP" });
  }
};


authCtrl.verifyOTPForgotPwd = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const valid = await OtpModel.findOne({ email, otp });
    if (!valid) return res.status(400).json({ msg: "Invalid OTP" });
    
    const user = await User.findOne({ email });
    const resetToken = generateResetToken(user._id);
    await OtpModel.deleteOne({ email, otp });

    res.json({ resetToken, msg: "OTP Verified" });
  } catch (err) {
    res.status(500).json({ msg: "Error verifying OTP" });
  }
};


authCtrl.changePwd = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Missing reset token" });
  if (password !== confirmPassword) return res.status(400).json({ msg: "Passwords do not match" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.purpose !== "password_reset") {
      return res.status(403).json({ msg: "Invalid token purpose" });
    }

    const hashed = await bcrypt.hash(password, 12); 
    await User.findByIdAndUpdate(decoded.userId, { password: hashed });
    
    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    res.status(401).json({ msg: "Token expired or invalid" });
  }
};






authCtrl.getAdminProfile = async (req, res) => {
  try {
   
    const user = await User.findById(req.user.userId).select("-password");
    
    if (!user) {
        return res.status(404).json({ msg: "admin not found" });
    }
    
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: "server error" });
  }
};





module.exports = authCtrl;


