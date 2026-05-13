


// const express = require("express");
// const router = express.Router();
// const testimonialCtrl = require("../controllers/TestimonialController");
// const { authMiddleware, adminChecker } = require("../middleware/tokenMiddlewares");
// const upload = require("../middleware/upload");


// router.get("/testimonials", testimonialCtrl.getPublishedTestimonials);


// router.get("/admin/testimonials", authMiddleware, adminChecker, testimonialCtrl.getAdminTestimonials);

// router.post("/admin/testimonials", 
//   authMiddleware, adminChecker, 
//   upload.array('images', 5), 
//   testimonialCtrl.upsertTestimonial
// );

// router.put("/admin/testimonials/:id", 
//   authMiddleware, adminChecker, 
//   upload.array('images', 5), 
//   testimonialCtrl.upsertTestimonial
// );

// router.delete("/admin/testimonials/:id", 
//   authMiddleware, adminChecker, 
//   testimonialCtrl.deleteTestimonial
// );

// module.exports = router;



const express = require("express");
const router = express.Router();
const testimonialCtrl = require("../controllers/TestimonialController");
const { authMiddleware, adminChecker } = require("../middleware/tokenMiddlewares");
const upload = require("../middleware/upload"); // Ensure this is your Cloudinary middleware

// PUBLIC
router.get("/testimonials", testimonialCtrl.getPublishedTestimonials);

// ADMIN
router.get("/admin/testimonials", authMiddleware, adminChecker, testimonialCtrl.getAdminTestimonials);

router.post("/admin/testimonials", 
  authMiddleware, adminChecker, 
  upload.array('images', 5), 
  testimonialCtrl.upsertTestimonial
);

// Note: ID is passed in params for PUT
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