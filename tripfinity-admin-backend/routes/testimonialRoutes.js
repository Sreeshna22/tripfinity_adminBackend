


const express = require("express");
const router = express.Router();
const testimonialCtrl = require("../controllers/TestimonialController");
const { authMiddleware, adminChecker } = require("../middleware/tokenMiddlewares");
const upload = require("../middleware/upload");


router.get("/testimonials", testimonialCtrl.getPublishedTestimonials);


router.get("/admin/testimonials", authMiddleware, adminChecker, testimonialCtrl.getAdminTestimonials);

router.post("/admin/testimonials", 
  authMiddleware, adminChecker, 
  upload.array('images', 5), 
  testimonialCtrl.upsertTestimonial
);

router.put("/admin/testimonials/:id", 
  authMiddleware, adminChecker, 
  upload.array('images', 5), 
  testimonialCtrl.upsertTestimonial
);

router.delete("/admin/testimonials/:id", 
  authMiddleware, adminChecker, 
  testimonialCtrl.deleteTestimonial
);

module.exports = router;