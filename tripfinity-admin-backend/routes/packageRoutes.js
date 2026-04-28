



const express = require("express");
const router = express.Router();
const pkgCtrl = require("../controllers/PackageController");
const { authMiddleware, adminChecker } = require("../middleware/tokenMiddlewares");
const upload = require("../middleware/upload");


router.get("/packages", pkgCtrl.getPublishedPackages);
router.get("/packages/:id", pkgCtrl.getPackageById);


router.get("/admin/packages", authMiddleware, adminChecker, pkgCtrl.getAdminPackages);

router.post("/admin/packages", 
  authMiddleware, adminChecker, 
  upload.array('images', 10), 
  pkgCtrl.upsertPackage
);

router.put("/admin/packages/:id", 
  authMiddleware, adminChecker, 
  upload.array('images', 10), 
  pkgCtrl.upsertPackage
);

router.delete("/admin/packages/:id", 
  authMiddleware, adminChecker, 
  pkgCtrl.deletePackage
);

module.exports = router;