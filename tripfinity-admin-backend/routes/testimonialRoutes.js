const express = require("express");
const router = express.Router();
const testimonialCtrl = require("../controllers/TestimonialController");
const { authMiddleware, adminChecker } = require("../middleware/tokenMiddlewares");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.get("/testimonials", testimonialCtrl.getPublishedTestimonials);


router.get("/admin/testimonials", authMiddleware, adminChecker, testimonialCtrl.getAdminTestimonials);

router.post("/admin/testimonials", 
  authMiddleware, adminChecker, upload.single('image'), testimonialCtrl.upsertTestimonial
);

router.put("/admin/testimonials/:id", 
  authMiddleware, adminChecker, upload.single('image'), testimonialCtrl.upsertTestimonial
);

router.delete("/admin/testimonials/:id", 
  authMiddleware, adminChecker, testimonialCtrl.deleteTestimonial
);

module.exports = router;