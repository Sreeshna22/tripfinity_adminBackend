const router = require("express").Router();
const contactCtrl = require("../controllers/ContactController");
const { authMiddleware, adminChecker } = require("../middleware/tokenMiddlewares");

router.post("/submit", contactCtrl.submitForm); 
router.get("/all", authMiddleware, adminChecker, contactCtrl.getAllRequests); 

module.exports = router;