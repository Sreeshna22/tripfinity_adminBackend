

const express = require("express");
const router = express.Router();
const requestCtrl = require("../controllers/RequestController");
const { authMiddleware, adminChecker } = require("../middleware/tokenMiddlewares");


router.post("/submit-request", requestCtrl.submitRequest);


router.get("/admin/requests", authMiddleware, adminChecker, requestCtrl.getAdminRequests);
router.put("/admin/requests/:id", authMiddleware, adminChecker, requestCtrl.updateStatus);

module.exports = router;