const Setting = require("../models/Setting");

const setCtrl = {
 
  upsertSetting: async (req, res) => {
    try {
      const { id } = req.params;
      if (id) {
        const updated = await Setting.findByIdAndUpdate(id, req.body, { new: true });
        return res.json(updated);
      }
      const newSetting = await Setting.create(req.body);
      res.json(newSetting);
    } catch (err) { res.status(500).json({ msg: err.message }); }
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
      await Setting.findByIdAndDelete(req.params.id);
      res.json({ msg: "Setting deleted successfully" });
    } catch (err) { res.status(500).json({ msg: err.message }); }
  }
};

module.exports = setCtrl;