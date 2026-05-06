

const Setting = require("../models/Setting");
const mongoose = require("mongoose"); 

const setCtrl = {
  upsertSetting: async (req, res) => {
    try {
      const { id } = req.params;
      const { min, max, category } = req.body;
      const name = req.body.name ? req.body.name.trim() : "";


      if (min !== undefined && (isNaN(Number(min)) || Number(min) < 0)) {
        return res.status(400).json({ msg: "Minimum value must be a positive number." });
      }
      if (max !== undefined && (isNaN(Number(max)) || Number(max) < 0)) {
        return res.status(400).json({ msg: "Maximum value must be a positive number." });
      }

 
      if (min !== undefined && max !== undefined && Number(max) < Number(min)) {
        return res.status(400).json({ msg: "Maximum value cannot be less than minimum value." });
      }


      if (name && category) {
        const duplicateQuery = { 
          name: { $regex: new RegExp(`^${name}$`, 'i') }, 
          category: category 
        };

        if (id && mongoose.Types.ObjectId.isValid(id.trim())) {
          duplicateQuery._id = { $ne: id.trim() };
        }

        const isDuplicate = await Setting.findOne(duplicateQuery);
        if (isDuplicate) {
          return res.status(400).json({ msg: `The entry '${name}' already exists in ${category}.` });
        }
      }

      if (id && mongoose.Types.ObjectId.isValid(id.trim())) {
        const cleanId = id.trim();
        const updated = await Setting.findByIdAndUpdate(
          cleanId, 
          { ...req.body, name }, 
          { new: true, runValidators: true }
        );
        
        if (!updated) return res.status(404).json({ msg: "Setting not found" });
        return res.json({ msg: "Setting updated successfully", updated });
      } else {
        const newSetting = await Setting.create({ ...req.body, name });
        return res.status(201).json({ msg: "Setting created successfully", newSetting });
      }
    } catch (err) { 

      if (err.code === 11000) {
        return res.status(400).json({ msg: "This entry already exists." });
      }
      res.status(500).json({ msg: "Server Error: " + err.message }); 
    }
  },
 
  getByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const data = await Setting.find({ category, status: "Active" });
      res.json(data);
    } catch (err) { res.status(500).json({ msg: err.message }); }
  },

  getAllSettingsAdmin: async (req, res) => {
    try {
      const data = await Setting.find().sort("category");
      res.json(data);
    } catch (err) { res.status(500).json({ msg: err.message }); }
  },

  deleteSetting: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id.trim())) {
        return res.status(400).json({ msg: "Invalid or missing ID format" });
      }

      const deleted = await Setting.findByIdAndDelete(id.trim());
      
      if (!deleted) {
        return res.status(404).json({ msg: "Setting not found or already deleted" });
      }

      res.json({ msg: "Setting deleted successfully" });
    } catch (err) { 
      res.status(500).json({ msg: "Delete Error: " + err.message }); 
    }
  }
};

module.exports = setCtrl;