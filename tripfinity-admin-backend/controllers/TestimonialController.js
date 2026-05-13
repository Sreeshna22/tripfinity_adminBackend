




// const Testimonial = require("../models/Testimonial");

// const testimonialCtrl = {
 
//  upsertTestimonial: async (req, res) => {
//     try {
//       const { id } = req.params;
      
      
//       const { customerName, title, rating, description, type, place, isPublished } = req.body;

//       let data = {
//         customerName,
//         title, 
//         rating: Number(rating),
//         description,
//         type,
//         place,
//         isPublished: isPublished === 'true' || isPublished === true
//       };

 
//       if (req.files && req.files.length > 0) {
//         const newImages = req.files.map(file => file.path);
//         if (id) {
//           const existing = await Testimonial.findById(id);
//           data.images = [...(existing?.images || []), ...newImages];
//         } else {
//           data.images = newImages;
//         }
//       }

//       if (id) {
//         const updated = await Testimonial.findByIdAndUpdate(id, { $set: data }, { new: true }).populate("place", "name");
//         if (!updated) return res.status(404).json({ msg: "Testimonial not found." });
//         return res.json({ msg: "Testimonial updated successfully!", updated });
//       }


//       const newTestimonial = new Testimonial(data);
//       await newTestimonial.save();
      
//       const result = await Testimonial.findById(newTestimonial._id).populate("place", "name");
//       res.status(201).json({ msg: "Testimonial added successfully!", result });
      
//     } catch (err) {
//       res.status(500).json({ msg: "Operation Failed: " + err.message });
//     }
//   },

//   getAdminTestimonials: async (req, res) => {
//     try {
//       const list = await Testimonial.find()
//         .populate("place", "name")
//         .sort("-createdAt");
//       res.json(list);
//     } catch (err) { 
//       res.status(500).json({ msg: err.message }); 
//     }
//   },

//   getPublishedTestimonials: async (req, res) => {
//     try {
//       const list = await Testimonial.find({ isPublished: true })
//         .populate("place", "name")
//         .sort("-createdAt");
//       res.json(list);
//     } catch (err) { 
//       res.status(500).json({ msg: err.message }); 
//     }
//   },

//   deleteTestimonial: async (req, res) => {
//     try {
//       const testimonial = await Testimonial.findById(req.params.id);
//       if (!testimonial) return res.status(404).json({ msg: "Testimonial not found." });

//       await Testimonial.findByIdAndDelete(req.params.id);
//       res.json({ msg: "Testimonial deleted successfully!" });
//     } catch (err) { 
//       res.status(500).json({ msg: err.message }); 
//     }
//   }
// };

// module.exports = testimonialCtrl;


const Testimonial = require("../models/Testimonial");

const testimonialCtrl = {
  // Handles POST (Create) and PUT (Update)
  upsertTestimonial: async (req, res) => {
    try {
      const { id } = req.params;
      
      // 1. Destructure text fields from req.body
      const { customerName, title, rating, description, type, place, isPublished } = req.body;

      // 2. Prepare data object with correct types
      let data = {
        customerName,
        title, 
        rating: Number(rating),
        description,
        type,
        place, // This is the ObjectId from Settings
        isPublished: isPublished === 'true' || isPublished === true
      };

      // 3. Handle Cloudinary Images
      // req.files.map(file => file.path) extracts the https:// URL from Cloudinary
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => file.path);
        
        if (id) {
          // If updating, get existing images and append new ones
          const existing = await Testimonial.findById(id);
          data.images = [...(existing?.images || []), ...newImages];
        } else {
          // If creating new
          data.images = newImages;
        }
      }

      // 4. Update existing testimonial
      if (id) {
        const updated = await Testimonial.findByIdAndUpdate(
          id, 
          { $set: data }, 
          { new: true }
        ).populate("place", "name");

        if (!updated) return res.status(404).json({ msg: "Testimonial not found." });
        return res.json({ msg: "Testimonial updated successfully!", updated });
      }

      // 5. Create new testimonial
      const newTestimonial = new Testimonial(data);
      await newTestimonial.save();
      
      // Re-fetch to populate the Place name for the response
      const result = await Testimonial.findById(newTestimonial._id).populate("place", "name");
      res.status(201).json({ msg: "Testimonial added successfully!", result });
      
    } catch (err) {
      res.status(500).json({ msg: "Operation Failed: " + err.message });
    }
  },

  // GET all for Admin
  getAdminTestimonials: async (req, res) => {
    try {
      const list = await Testimonial.find()
        .populate("place", "name")
        .sort("-createdAt");
      res.json(list);
    } catch (err) { 
      res.status(500).json({ msg: "Failed to fetch admin testimonials: " + err.message }); 
    }
  },

  // GET published for Frontend
  getPublishedTestimonials: async (req, res) => {
    try {
      const list = await Testimonial.find({ isPublished: true })
        .populate("place", "name")
        .sort("-createdAt");
      res.json(list);
    } catch (err) { 
      res.status(500).json({ msg: "Failed to fetch testimonials: " + err.message }); 
    }
  },

  // DELETE
  deleteTestimonial: async (req, res) => {
    try {
      const testimonial = await Testimonial.findById(req.params.id);
      if (!testimonial) return res.status(404).json({ msg: "Testimonial not found." });

      await Testimonial.findByIdAndDelete(req.params.id);
      res.json({ msg: "Testimonial deleted successfully!" });
    } catch (err) { 
      res.status(500).json({ msg: "Delete Failed: " + err.message }); 
    }
  }
};

module.exports = testimonialCtrl;