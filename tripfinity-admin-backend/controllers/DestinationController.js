






// const Destination = require("../models/Destination");
// const fs = require("fs");
// const mongoose = require("mongoose");

// const destCtrl = {

//   getSettingsByCategory: async (req, res) => {
//     try {
      
//       res.json({ msg: `Fetching settings for ${req.params.category}` });
//     } catch (err) {
//       res.status(500).json({ msg: err.message });
//     }
//   },

//   addSetting: async (req, res) => {
//     try {
//       const { min, max } = req.body;
 
//       if (min !== undefined && max !== undefined && Number(max) < Number(min)) {
//         return res.status(400).json({ msg: "Maximum value cannot be less than minimum value." });
//       }
//       res.json({ msg: "Setting saved successfully" });
//     } catch (err) {
//       res.status(500).json({ msg: err.message });
//     }
//   },

//   createDestination: async (req, res) => {
//     try {
//       const { name, place, shortDescription, longDescription, status } = req.body;

//       if (!shortDescription || !longDescription) {
//         return res.status(400).json({ msg: "Both short and long descriptions are required." });
//       }

//       let coverImage = "";
//       let galleryImages = [];

//       if (req.files) {
//         if (req.files.coverImage) coverImage = req.files.coverImage[0].path;
//         if (req.files.galleryImages) galleryImages = req.files.galleryImages.map(file => file.path);
//       }

//       const newDestination = new Destination({
//         name, place, shortDescription, longDescription,
//         status: status || "Draft",
//         coverImage, galleryImages
//       });

//       await newDestination.save();
//       res.status(201).json({ msg: "Destination created successfully", newDestination });
//     } catch (err) {
//       res.status(500).json({ msg: err.message });
//     }
//   },

//   updateDestination: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const cleanId = id.trim();
//       const updateData = { ...req.body };

//       const existing = await Destination.findById(cleanId);
//       if (!existing) return res.status(404).json({ msg: "Destination not found" });

//       if (req.files) {
//         if (req.files.coverImage) updateData.coverImage = req.files.coverImage[0].path;
//         if (req.files.galleryImages) {
//           const newGallery = req.files.galleryImages.map(file => file.path);
//           updateData.galleryImages = [...existing.galleryImages, ...newGallery];
//         }
//       }

//       const updated = await Destination.findByIdAndUpdate(
//         cleanId,
//         { $set: updateData },
//         { new: true, runValidators: true }
//       );

//       res.json({ msg: "Destination updated successfully", updated });
//     } catch (err) {
//       res.status(500).json({ msg: err.message });
//     }
//   },

//   getAllDestinationsAdmin: async (req, res) => {
//     try {
//       const { search } = req.query;
//       let query = {};

//       if (search) {
//         query = {
//           $or: [
//             { name: { $regex: search, $options: "i" } },
//             { place: { $regex: search, $options: "i" } }
//           ]
//         };
//       }

//       const list = await Destination.find(query).sort("-createdAt");
//       res.json(list);
//     } catch (err) {
//       res.status(500).json({ msg: err.message });
//     }
//   },

//   getPublishedDestinations: async (req, res) => {
//   try {
  
//     const list = await Destination.find({ isPublished: true }).sort("-createdAt");
//     res.json(list);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// },

//   deleteDestination: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const cleanId = id.trim();
//       const dest = await Destination.findById(cleanId);
      
//       if (!dest) return res.status(404).json({ msg: "Destination not found" });

//       if (dest.coverImage && fs.existsSync(dest.coverImage)) fs.unlinkSync(dest.coverImage);
//       dest.galleryImages.forEach(img => {
//         if (fs.existsSync(img)) fs.unlinkSync(img);
//       });

//       await Destination.findByIdAndDelete(cleanId);
//       res.json({ msg: "Destination deleted successfully" });
//     } catch (err) {
//       res.status(500).json({ msg: err.message });
//     }
//   }
// };

// module.exports = destCtrl;

const Destination = require("../models/Destination");
const fs = require("fs");
const mongoose = require("mongoose");

const destCtrl = {
 
  getSettingsByCategory: async (req, res) => {
    try {
      res.json({ msg: `Fetching settings for ${req.params.category}` });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  addSetting: async (req, res) => {
    try {
      const { min, max } = req.body;

      if (min !== undefined && Number(min) < 0) {
        return res.status(400).json({ msg: "Minimum value cannot be negative." });
      }
      if (max !== undefined && Number(max) < 0) {
        return res.status(400).json({ msg: "Maximum value cannot be negative." });
      }
 
      if (min !== undefined && max !== undefined && Number(max) < Number(min)) {
        return res.status(400).json({ msg: "Maximum value cannot be less than minimum value." });
      }
      res.json({ msg: "Setting saved successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  createDestination: async (req, res) => {
    try {
      const { name, place, shortDescription, longDescription, isPublished } = req.body;

      
      if (!shortDescription || !longDescription) {
        return res.status(400).json({ msg: "Both short and long descriptions are required." });
      }

      let coverImage = "";
      let galleryImages = [];

      if (req.files) {
        if (req.files.coverImage) coverImage = req.files.coverImage[0].path;
        if (req.files.galleryImages) galleryImages = req.files.galleryImages.map(file => file.path);
      }

      const newDestination = new Destination({
        name, 
        place, 
        shortDescription, 
        longDescription,
        isPublished: isPublished || false, 
        coverImage, 
        galleryImages
      });

      await newDestination.save();
      res.status(201).json({ msg: "Destination created successfully", newDestination });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },


  updateDestination: async (req, res) => {
    try {
      const { id } = req.params;
      const cleanId = id.trim();
      const { shortDescription, longDescription } = req.body;
      const updateData = { ...req.body };

    
      if (shortDescription === "" || longDescription === "") {
        return res.status(400).json({ msg: "Descriptions cannot be empty." });
      }

      const existing = await Destination.findById(cleanId);
      if (!existing) return res.status(404).json({ msg: "Destination not found" });

      if (req.files) {
        if (req.files.coverImage) updateData.coverImage = req.files.coverImage[0].path;
        if (req.files.galleryImages) {
          const newGallery = req.files.galleryImages.map(file => file.path);
          updateData.galleryImages = [...existing.galleryImages, ...newGallery];
        }
      }

      const updated = await Destination.findByIdAndUpdate(
        cleanId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      res.json({ msg: "Destination updated successfully", updated });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getAllDestinationsAdmin: async (req, res) => {
    try {
      const { search } = req.query;
      let query = {};

      if (search) {
        query = {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { place: { $regex: search, $options: "i" } }
          ]
        };
      }

      const list = await Destination.find(query).sort("-createdAt");
      res.json(list);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getPublishedDestinations: async (req, res) => {
    try {
      const list = await Destination.find({ isPublished: true }).sort("-createdAt");
      res.json(list);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  deleteDestination: async (req, res) => {
    try {
      const { id } = req.params;
      const cleanId = id.trim();
      const dest = await Destination.findById(cleanId);
      
      if (!dest) return res.status(404).json({ msg: "Destination not found" });

      if (dest.coverImage && fs.existsSync(dest.coverImage)) fs.unlinkSync(dest.coverImage);
      dest.galleryImages.forEach(img => {
        if (fs.existsSync(img)) fs.unlinkSync(img);
      });

      await Destination.findByIdAndDelete(cleanId);
      res.json({ msg: "Destination deleted successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = destCtrl;