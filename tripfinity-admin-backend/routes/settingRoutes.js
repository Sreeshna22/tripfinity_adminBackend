const express = require("express");
const router = express.Router();
const setCtrl = require("../controllers/SettingController");
const { authMiddleware, adminChecker } = require("../middleware/tokenMiddlewares");

router.get("/settings/:category", setCtrl.getByCategory);


router.get("/admin/settings", authMiddleware, adminChecker, setCtrl.getAllSettingsAdmin);

router.post("/admin/settings", 
  authMiddleware, 
  adminChecker, 
  setCtrl.upsertSetting
);

router.put("/admin/settings/:id", 
  authMiddleware, 
  adminChecker, 
  setCtrl.upsertSetting
);

router.delete("/admin/settings/:id", 
  authMiddleware, 
  adminChecker, 
  setCtrl.deleteSetting
);

module.exports = router;