






const express = require("express");
const router = express.Router();

const destCtrl = require("../controllers/DestinationController");
const upload = require("../middleware/upload.js");
const { authMiddleware, adminChecker } = require("../middleware/tokenMiddlewares");

router.get("/destinations", destCtrl.getPublishedDestinations);
router.get("/settings/:category", destCtrl.getSettingsByCategory);


router.get("/admin/destinations", authMiddleware, adminChecker, destCtrl.getAllDestinationsAdmin);

router.post("/settings", authMiddleware, adminChecker, destCtrl.addSetting);

router.post(
  "/destinations",
  authMiddleware,
  adminChecker,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 }
  ]),
  destCtrl.createDestination
);

router.put(
  "/destinations/:id",
  authMiddleware,
  adminChecker,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 }
  ]),
  destCtrl.updateDestination
);

router.delete(
  "/destinations/:id",
  authMiddleware,
  adminChecker,
  destCtrl.deleteDestination
);

module.exports = router;