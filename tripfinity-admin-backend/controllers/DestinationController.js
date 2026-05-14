// const Destination = require("../models/Destination");
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
//       res.status(200).json({ msg: "Setting added successfully" });
//     } catch (err) {
//       res.status(500).json({ msg: err.message });
//     }
//   },

 
//   getPublishedDestinations: async (req, res) => {
//     try {
//       const list = await Destination.find({ isPublished: true })
//         .populate("place type idealFor", "name")
//         .sort("-createdAt");
//       res.json(list);
//     } catch (err) {
//       res.status(500).json({ msg: "Internal Server Error: Failed to fetch destinations." });
//     }
//   },

//   createDestination: async (req, res) => {
//     try {
//       const { name, place, type, idealFor } = req.body;

     
//       if (!name || !place || !type) {
//         return res.status(400).json({ msg: "Missing fields: Name, Place, and Type are required." });
//       }

 
//       const existingDest = await Destination.findOne({ 
//         name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
//         place: place 
//       });
      
//       if (existingDest) {
//         return res.status(409).json({ msg: `Conflict: A destination named "${name}" already exists in this location.` });
//       }

    
//       const newCoverPath = req.files?.coverImage ? req.files.coverImage[0].path : "";
//       const newGalleryPaths = req.files?.galleryImages ? req.files.galleryImages.map(f => f.path) : [];

//       const newDestination = new Destination({
//         ...req.body,
//         name: name.trim(),
//         idealFor: Array.isArray(idealFor) ? idealFor : (idealFor ? [idealFor] : []),
//         isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
//         isPopular: req.body.isPopular === 'true' || req.body.isPopular === true,
//         coverImage: newCoverPath,
//         galleryImages: newGalleryPaths
//       });

//       await newDestination.save();
//       const result = await Destination.findById(newDestination._id).populate("place type idealFor", "name");

//       res.status(201).json({ msg: "Success: Destination created successfully!", newDestination: result });
//     } catch (err) {
//       res.status(500).json({ msg: "Creation Failed: " + err.message });
//     }
//   },

//   getAllDestinationsAdmin: async (req, res) => {
//     try {
//       const { search } = req.query;
//       let query = search ? { name: { $regex: search, $options: "i" } } : {};
//       const list = await Destination.find(query).populate("place type idealFor", "name").sort("-createdAt");
//       res.json(list);
//     } catch (err) {
//       res.status(500).json({ msg: "Admin Error: Failed to fetch destinations." });
//     }
//   },

//   updateDestination: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const existing = await Destination.findById(id);
//       if (!existing) return res.status(404).json({ msg: "Error: Destination not found." });

//       const updateData = { ...req.body };

  
//       if (req.files?.coverImage) {
//         updateData.coverImage = req.files.coverImage[0].path;
//       }
      
   
//       if (req.files?.galleryImages) {
//         const newImgs = req.files.galleryImages.map(f => f.path);
//         updateData.galleryImages = [...existing.galleryImages, ...newImgs];
//       }

//       const updated = await Destination.findByIdAndUpdate(id, { $set: updateData }, { new: true })
//         .populate("place type idealFor", "name");

//       res.json({ msg: "Success: Destination updated successfully", updated });
//     } catch (err) {
//       res.status(500).json({ msg: "Update Failed: " + err.message });
//     }
//   },

//   deleteDestination: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const result = await Destination.findByIdAndDelete(id);
//       if (!result) return res.status(404).json({ msg: "Error: Destination already deleted or not found." });
      
//       res.json({ msg: "Success: Destination deleted successfully." });
//     } catch (err) {
//       res.status(500).json({ msg: "Delete Error: " + err.message });
//     }
//   }
// };

// module.exports = destCtrl;



// const Destination = require("../models/Destination");

// const destCtrl = {
//   // PUBLIC: Fetch published destinations
//   getPublishedDestinations: async (req, res) => {
//     try {
//       const list = await Destination.find({ isPublished: true })
//         .populate("place type idealFor", "name")
//         .sort("-createdAt");
//       res.json(list);
//     } catch (err) {
//       res.status(500).json({ msg: "Internal Server Error: Failed to fetch destinations." });
//     }
//   },

//   // ADMIN: Create Destination
//   createDestination: async (req, res) => {
//     try {
//       const { name, place, type, idealFor } = req.body;

//       // 1. Validate required fields
//       if (!name || !place || !type) {
//         return res.status(400).json({ msg: "Name, Place, and Type are required." });
//       }

//       // 2. Strict Duplicate Check (Check if name exists in the same place)
//       const existingDest = await Destination.findOne({ 
//         name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
//         place: place 
//       });
      
//       if (existingDest) {
//         return res.status(409).json({ msg: `A destination named "${name}" already exists in this location.` });
//       }

//       // 3. Extract Cloudinary URLs from req.files
//       // req.files.coverImage[0].path contains the full HTTPS URL
//       const newCoverPath = req.files?.coverImage ? req.files.coverImage[0].path : "";
//       const newGalleryPaths = req.files?.galleryImages ? req.files.galleryImages.map(f => f.path) : [];

//       const newDestination = new Destination({
//         ...req.body,
//         name: name.trim(),
//         // Handle array conversion if sent as a single string from frontend
//         idealFor: Array.isArray(idealFor) ? idealFor : (idealFor ? [idealFor] : []),
//         // Convert strings to Booleans
//         isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
//         isPopular: req.body.isPopular === 'true' || req.body.isPopular === true,
//         coverImage: newCoverPath,
//         galleryImages: newGalleryPaths
//       });

//       await newDestination.save();
      
//       const result = await Destination.findById(newDestination._id)
//         .populate("place type idealFor", "name");

//       res.status(201).json({ msg: "Destination created successfully!", newDestination: result });
//     } catch (err) {
//       res.status(500).json({ msg: "Creation Failed: " + err.message });
//     }
//   },

//   // ADMIN: Get all for table view
//   getAllDestinationsAdmin: async (req, res) => {
//     try {
//       const { search } = req.query;
//       let query = search ? { name: { $regex: search, $options: "i" } } : {};
//       const list = await Destination.find(query)
//         .populate("place type idealFor", "name")
//         .sort("-createdAt");
//       res.json(list);
//     } catch (err) {
//       res.status(500).json({ msg: "Failed to fetch destinations." });
//     }
//   },

//   // ADMIN: Update Destination
//   updateDestination: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const existing = await Destination.findById(id);
//       if (!existing) return res.status(404).json({ msg: "Destination not found." });

//       let updateData = { ...req.body };

//       // Update Cover Image if a new file is uploaded
//       if (req.files?.coverImage) {
//         updateData.coverImage = req.files.coverImage[0].path;
//       }
      
//       // Append to Gallery if new files are uploaded
//       if (req.files?.galleryImages) {
//         const newImgs = req.files.galleryImages.map(f => f.path);
//         updateData.galleryImages = [...(existing.galleryImages || []), ...newImgs];
//       }

//       // Convert Boolean strings
//       if (updateData.isPublished !== undefined) {
//         updateData.isPublished = updateData.isPublished === 'true' || updateData.isPublished === true;
//       }
//       if (updateData.isPopular !== undefined) {
//         updateData.isPopular = updateData.isPopular === 'true' || updateData.isPopular === true;
//       }

//       const updated = await Destination.findByIdAndUpdate(id, { $set: updateData }, { new: true })
//         .populate("place type idealFor", "name");

//       res.json({ msg: "Destination updated successfully", updated });
//     } catch (err) {
//       res.status(500).json({ msg: "Update Failed: " + err.message });
//     }
//   },

//   // ADMIN: Delete
//   deleteDestination: async (req, res) => {
//     try {
//       const result = await Destination.findByIdAndDelete(req.params.id);
//       if (!result) return res.status(404).json({ msg: "Destination not found." });
//       res.json({ msg: "Destination deleted successfully." });
//     } catch (err) {
//       res.status(500).json({ msg: "Delete Error: " + err.message });
//     }
//   }
// };

// module.exports = destCtrl;



// const Destination = require("../models/Destination");

// const destCtrl = {
//   // Placeholder for settings logic (Required to prevent route crash)
//   getSettingsByCategory: async (req, res) => {
//     try {
//       const { category } = req.params;
//       res.json({ msg: `Fetching settings for ${category}` });
//     } catch (err) {
//       res.status(500).json({ msg: err.message });
//     }
//   },

//   addSetting: async (req, res) => {
//     try {
//       res.status(200).json({ msg: "Setting logic placeholder" });
//     } catch (err) {
//       res.status(500).json({ msg: err.message });
//     }
//   },

//   // PUBLIC: Fetch published destinations
//   getPublishedDestinations: async (req, res) => {
//     try {
//       const list = await Destination.find({ isPublished: true })
//         .populate("place type idealFor", "name")
//         .sort("-createdAt");
//       res.json(list);
//     } catch (err) {
//       res.status(500).json({ msg: "Failed to fetch destinations." });
//     }
//   },

//   // ADMIN: Create Destination with Duplicate Check
//   createDestination: async (req, res) => {
//     try {
//       const { name, place, type, idealFor } = req.body;

//       if (!name || !place || !type) {
//         return res.status(400).json({ msg: "Missing fields: Name, Place, and Type are required." });
//       }

//       // Duplicate Check: Same name in the same place
//       const existingDest = await Destination.findOne({ 
//         name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
//         place: place 
//       });
      
//       if (existingDest) {
//         return res.status(409).json({ msg: `Conflict: A destination named "${name}" already exists in this location.` });
//       }

//       const newCoverPath = req.files?.coverImage ? req.files.coverImage[0].path : "";
//       const newGalleryPaths = req.files?.galleryImages ? req.files.galleryImages.map(f => f.path) : [];

//       const newDestination = new Destination({
//         ...req.body,
//         name: name.trim(),
//         // idealFor: Array.isArray(idealFor) ? idealFor : (idealFor ? [idealFor] : []),
//         idealFor: parseMultipleSelect(idealFor),
//         isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
//         isPopular: req.body.isPopular === 'true' || req.body.isPopular === true,
//         coverImage: newCoverPath,
//         galleryImages: newGalleryPaths
//       });

//       await newDestination.save();
//       const result = await Destination.findById(newDestination._id).populate("place type idealFor", "name");

//       res.status(201).json({ msg: "Destination created successfully!", result });
//     } catch (err) {
//       res.status(500).json({ msg: "Creation Failed: " + err.message });
//     }
//   },

//   // ADMIN: Get all for table view
//   getAllDestinationsAdmin: async (req, res) => {
//     try {
//       const { search } = req.query;
//       let query = search ? { name: { $regex: search, $options: "i" } } : {};
//       const list = await Destination.find(query)
//         .populate("place type idealFor", "name")
//         .sort("-createdAt");
//       res.json(list);
//     } catch (err) {
//       res.status(500).json({ msg: "Failed to fetch destinations." });
//     }
//   },

//   // ADMIN: Update Destination
//   updateDestination: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const existing = await Destination.findById(id);
//       if (!existing) return res.status(404).json({ msg: "Destination not found." });

//       let updateData = { ...req.body };

//       if (req.files?.coverImage) {
//         updateData.coverImage = req.files.coverImage[0].path;
//       }
      
//       if (req.files?.galleryImages) {
//         const newImgs = req.files.galleryImages.map(f => f.path);
//         updateData.galleryImages = [...(existing.galleryImages || []), ...newImgs];
//       }

//       // Proper Boolean conversion
//       if (updateData.isPublished !== undefined) {
//         updateData.isPublished = updateData.isPublished === 'true' || updateData.isPublished === true;
//       }
//       if (updateData.isPopular !== undefined) {
//         updateData.isPopular = updateData.isPopular === 'true' || updateData.isPopular === true;
//       }

//       const updated = await Destination.findByIdAndUpdate(id, { $set: updateData }, { new: true })
//         .populate("place type idealFor", "name");

//       res.json({ msg: "Destination updated successfully", updated });
//     } catch (err) {
//       res.status(500).json({ msg: "Update Failed: " + err.message });
//     }
//   },

//   // ADMIN: Delete
//   deleteDestination: async (req, res) => {
//     try {
//       const result = await Destination.findByIdAndDelete(req.params.id);
//       if (!result) return res.status(404).json({ msg: "Destination not found." });
//       res.json({ msg: "Destination deleted successfully." });
//     } catch (err) {
//       res.status(500).json({ msg: "Delete Error: " + err.message });
//     }
//   }
// };

// module.exports = destCtrl;



const Destination = require("../models/Destination");
const mongoose = require("mongoose");


const parseMultipleSelect = (value) => {
  if (!value || value === "undefined" || value === "") return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {

    return value.split(",").map(item => item.trim()).filter(Boolean);
  }
  return [value];
};

const destCtrl = {

  getSettingsByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      res.json({ msg: `Fetching settings for ${category}` });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  addSetting: async (req, res) => {
    try {
      res.status(200).json({ msg: "Setting logic placeholder" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },


  getPublishedDestinations: async (req, res) => {
    try {
      const list = await Destination.find({ isPublished: true })
        .populate("place type idealFor", "name")
        .sort("-createdAt");
      res.json(list);
    } catch (err) {
      res.status(500).json({ msg: "Failed to fetch destinations." });
    }
  },


  createDestination: async (req, res) => {
    try {
      const { name, place, type, idealFor } = req.body;

      if (!name || !place || !type) {
        return res.status(400).json({ msg: "Missing fields: Name, Place, and Type are required." });
      }

   
      const existingDest = await Destination.findOne({ 
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        place: place 
      });
      
      if (existingDest) {
        return res.status(409).json({ msg: `Conflict: A destination named "${name}" already exists in this location.` });
      }

      const newCoverPath = req.files?.coverImage ? req.files.coverImage[0].path : "";
      const newGalleryPaths = req.files?.galleryImages ? req.files.galleryImages.map(f => f.path) : [];

      const newDestination = new Destination({
        ...req.body,
        name: name.trim(),
       
        idealFor: parseMultipleSelect(idealFor),
        isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
        isPopular: req.body.isPopular === 'true' || req.body.isPopular === true,
        coverImage: newCoverPath,
        galleryImages: newGalleryPaths
      });

      await newDestination.save();
      const result = await Destination.findById(newDestination._id).populate("place type idealFor", "name");

      res.status(201).json({ msg: "Destination created successfully!", result });
    } catch (err) {
      res.status(500).json({ msg: "Creation Failed: " + err.message });
    }
  },


  getAllDestinationsAdmin: async (req, res) => {
    try {
      const { search } = req.query;
      let query = search ? { name: { $regex: search, $options: "i" } } : {};
      const list = await Destination.find(query)
        .populate("place type idealFor", "name")
        .sort("-createdAt");
      res.json(list);
    } catch (err) {
      res.status(500).json({ msg: "Failed to fetch destinations." });
    }
  },


  updateDestination: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await Destination.findById(id);
      if (!existing) return res.status(404).json({ msg: "Destination not found." });

      let updateData = { ...req.body };


      if (updateData.idealFor) {
        updateData.idealFor = parseMultipleSelect(updateData.idealFor);
      }

      if (req.files?.coverImage) {
        updateData.coverImage = req.files.coverImage[0].path;
      }
      
      if (req.files?.galleryImages) {
        const newImgs = req.files.galleryImages.map(f => f.path);
        updateData.galleryImages = [...(existing.galleryImages || []), ...newImgs];
      }

  
      if (updateData.isPublished !== undefined) {
        updateData.isPublished = updateData.isPublished === 'true' || updateData.isPublished === true;
      }
      if (updateData.isPopular !== undefined) {
        updateData.isPopular = updateData.isPopular === 'true' || updateData.isPopular === true;
      }

      const updated = await Destination.findByIdAndUpdate(id, { $set: updateData }, { new: true })
        .populate("place type idealFor", "name");

      res.json({ msg: "Destination updated successfully", updated });
    } catch (err) {
      res.status(500).json({ msg: "Update Failed: " + err.message });
    }
  },


  deleteDestination: async (req, res) => {
    try {
      const result = await Destination.findByIdAndDelete(req.params.id);
      if (!result) return res.status(404).json({ msg: "Destination not found." });
      res.json({ msg: "Destination deleted successfully." });
    } catch (err) {
      res.status(500).json({ msg: "Delete Error: " + err.message });
    }
  }
};

module.exports = destCtrl;