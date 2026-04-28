





const Destination = require("../models/Destination");
const Setting = require("../models/Setting");
const fs = require("fs");
const path = require("path");

const destCtrl = {

  addSetting: async (req, res) => {
    try {
      const newSetting = await Setting.create(req.body);
      res.json(newSetting);
    } catch (err) { res.status(500).json({ msg: err.message }); }
  },

  getSettingsByCategory: async (req, res) => {
    try {
      const data = await Setting.find({ category: req.params.category, status: "Active" });
      res.json(data);
    } catch (err) { res.status(500).json({ msg: err.message }); }
  },


  createDestination: async (req, res) => {
    try {
      const { name, place, type, shortDescription, longDescription, idealFor, isPublished, isPopular } = req.body;
      
      const coverImage = req.files?.coverImage ? req.files.coverImage[0].path : "";
      const galleryImages = req.files?.galleryImages ? req.files.galleryImages.map(f => f.path) : [];

      let parsedIdealFor = [];
      if (idealFor) {
        parsedIdealFor = typeof idealFor === 'string' ? JSON.parse(idealFor) : idealFor;
      }

      const destination = await Destination.create({
        name, place, type, shortDescription, longDescription, 
        idealFor: parsedIdealFor,
        coverImage, galleryImages, isPublished, isPopular
      });

      res.status(201).json({ msg: "Destination Created", destination });
    } catch (err) { res.status(500).json({ msg: err.message }); }
  },

  getPublishedDestinations: async (req, res) => {
    try {
      const { type, isPopular } = req.query;
      let queryObj = { isPublished: true };

      if (type) {
        queryObj.idealFor = { $in: [type] }; 
      }

      if (isPopular === 'true') {
        queryObj.isPopular = true;
      }

      const list = await Destination.find(queryObj)
        .populate("place type", "name")
        .sort({ createdAt: -1 });

      res.json(list);
    } catch (err) { 
      res.status(500).json({ msg: err.message }); 
    }
  },


  getAllDestinationsAdmin: async (req, res) => {
    try {
      const list = await Destination.find().populate("place type", "name");
      res.json(list);
    } catch (err) { res.status(500).json({ msg: err.message }); }
  },

  updateDestination: async (req, res) => {
    try {
      const existingDest = await Destination.findById(req.params.id);
      if (!existingDest) return res.status(404).json({ msg: "Destination not found" });

      let updateData = { ...req.body };

      if (req.body.idealFor) {
        updateData.idealFor = typeof req.body.idealFor === 'string' ? JSON.parse(req.body.idealFor) : req.body.idealFor;
      }

      if (req.files?.coverImage) {
        if (existingDest.coverImage && fs.existsSync(existingDest.coverImage)) {
          fs.unlink(existingDest.coverImage, (err) => { if (err) console.log(err); });
        }
        updateData.coverImage = req.files.coverImage[0].path;
      }

      if (req.files?.galleryImages) {
        const newImages = req.files.galleryImages.map(f => f.path);
        updateData.galleryImages = [...existingDest.galleryImages, ...newImages];
      }

      const updated = await Destination.findByIdAndUpdate(req.params.id, updateData, { new: true });
      res.json({ msg: "Updated successfully", updated });
    } catch (err) { res.status(500).json({ msg: err.message }); }
  },


  deleteDestination: async (req, res) => {
    try {
      const destination = await Destination.findById(req.params.id);
      if (!destination) return res.status(404).json({ msg: "Not found" });

      const allImages = [destination.coverImage, ...destination.galleryImages];
      allImages.forEach(img => {
        if (img && fs.existsSync(img)) {
          fs.unlink(img, (err) => { if (err) console.log(err); });
        }
      });

      await Destination.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted successfully" });
    } catch (err) { res.status(500).json({ msg: err.message }); }
  }
};

module.exports = destCtrl;