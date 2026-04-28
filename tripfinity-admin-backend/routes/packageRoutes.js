const express = require("express");
const router = express.Router();
const pkgCtrl = require("../controllers/PackageController");
const { authMiddleware, adminChecker } = require("../middleware/tokenMiddlewares");
const multer = require("multer");


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });


router.get("/packages", pkgCtrl.getPublishedPackages); 
router.get("/packages/:id", pkgCtrl.getPackageById);


router.get("/admin/packages", authMiddleware, adminChecker, pkgCtrl.getAdminPackages);

router.post("/packages", 
  authMiddleware, 
  adminChecker, 
  upload.single('image'), 
  pkgCtrl.upsertPackage
);

router.put("/packages/:id", 
  authMiddleware, 
  adminChecker, 
  upload.single('image'), 
  pkgCtrl.upsertPackage
);

router.delete("/packages/:id", 
  authMiddleware, 
  adminChecker, 
  pkgCtrl.deletePackage
);

module.exports = router;