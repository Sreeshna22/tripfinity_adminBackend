
 


const express = require("express");
const authRouter = express.Router();

const authCtrl = require("../controllers/AuthController");
const { authMiddleware, adminChecker } = require("../middleware/tokenMiddlewares");



authRouter.post("/admin-login", authCtrl.AdminLogin);
authRouter.post("/forgot-pwd/send-otp", authCtrl.sendOTPForgotPwd);
authRouter.post("/forgot-pwd/verify-otp", authCtrl.verifyOTPForgotPwd);
authRouter.post("/change-pwd", authCtrl.changePwd);
authRouter.get("/admin-profile", authMiddleware, adminChecker, authCtrl.getAdminProfile);

module.exports = authRouter;