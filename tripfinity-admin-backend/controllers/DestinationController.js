const Destination = require("../models/Destination");
const fs = require("fs");

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
      res.json({ msg: "Setting added successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },


  createDestination: async (req, res) => {
    try {
      const { name, place, type, idealFor, shortDescription, longDescription, isPublished, isPopular } = req.body;

      if (!name || !shortDescription || !longDescription) {
        return res.status(400).json({ msg: "Required fields are missing." });
      }

      let coverImage = req.files?.coverImage ? req.files.coverImage[0].path : "";
      let galleryImages = req.files?.galleryImages ? req.files.galleryImages.map(file => file.path) : [];

      const newDestination = new Destination({
        name,
        place,
        type,
    
        idealFor: Array.isArray(idealFor) ? idealFor : (idealFor ? [idealFor] : []),
        shortDescription,
        longDescription,
        isPublished: isPublished === 'true' || isPublished === true,
        isPopular: isPopular === 'true' || isPopular === true,
        coverImage,
        galleryImages
      });

      await newDestination.save();

   
      const result = await Destination.findById(newDestination._id)
        .populate("place", "name -_id")
.populate("type", "name -_id")
.populate("idealFor", "name -_id")

      res.status(201).json({ msg: "Destination created successfully", newDestination: result });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },


  getAllDestinationsAdmin: async (req, res) => {
    try {
      const { search } = req.query;
      let query = {};
      if (search) {
        query = { name: { $regex: search, $options: "i" } };
      }

      const list = await Destination.find(query)
 .populate("place", "name -_id")
.populate("type", "name -_id")
.populate("idealFor", "name -_id")
        .sort("-createdAt");

      res.json(list);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getPublishedDestinations: async (req, res) => {
    try {
      const list = await Destination.find({ isPublished: true })
   .populate("place", "name -_id")
.populate("type", "name -_id")
.populate("idealFor", "name -_id")
        .sort("-createdAt");
      res.json(list);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },


  updateDestination: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      const existing = await Destination.findById(id);
      
      if (!existing) return res.status(404).json({ msg: "Destination not found" });

      if (req.files?.coverImage) {
        if (existing.coverImage && fs.existsSync(existing.coverImage)) fs.unlinkSync(existing.coverImage);
        updateData.coverImage = req.files.coverImage[0].path;
      }
      
      if (req.files?.galleryImages) {
        const newImgs = req.files.galleryImages.map(file => file.path);
        updateData.galleryImages = [...existing.galleryImages, ...newImgs];
      }

      const updated = await Destination.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).populate("place", "name -_id")
.populate("type", "name -_id")
.populate("idealFor", "name -_id")

      res.json({ msg: "Updated successfully", updated });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

 
  deleteDestination: async (req, res) => {
    try {
      const dest = await Destination.findById(req.params.id);
      if (!dest) return res.status(404).json({ msg: "Not found" });

      if (dest.coverImage && fs.existsSync(dest.coverImage)) fs.unlinkSync(dest.coverImage);
      dest.galleryImages.forEach(img => { if (fs.existsSync(img)) fs.unlinkSync(img); });

      await Destination.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = destCtrl;