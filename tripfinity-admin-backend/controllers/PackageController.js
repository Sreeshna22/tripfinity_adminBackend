const Package = require("../models/Package");
const fs = require("fs"); 

const pkgCtrl = {
  upsertPackage: async (req, res) => {
    try {
      const { id } = req.params;
      let data = { ...req.body };

      
      if (data.itinerary && typeof data.itinerary === 'string') {
        try {
          data.itinerary = JSON.parse(data.itinerary);
        } catch (e) {
          return res.status(400).json({ msg: "itinerary must be a valid JSON array" });
        }
      }

      
      if (data.idealFor && typeof data.idealFor === 'string') {
        try {
          data.idealFor = JSON.parse(data.idealFor);
        } catch (e) {
          data.idealFor = data.idealFor.split(","); 
        }
      }

      
      if (req.file) {
        data.image = req.file.path; 
      }

      if (id) {
        
        const updated = await Package.findByIdAndUpdate(id, data, { new: true });
        if (!updated) return res.status(404).json({ msg: "Package not found" });
        return res.json({ msg: "Updated successfully", updated });
      }

      
      const newPkg = await Package.create(data);
      res.json({ msg: "Created successfully", newPkg });

    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getAdminPackages: async (req, res) => {
    try {
      const list = await Package.find()
        .populate({ 
          path: "destination", 
          populate: { path: "place", select: "name" } 
        })
        .sort("-createdAt");
      res.json(list);
    } catch (err) { res.status(500).json({ msg: err.message }); }
  },

  getPublishedPackages: async (req, res) => {
    try {
      const list = await Package.find({ isPublished: true })
        .populate("destination", "name")
        .sort("-createdAt");
      res.json(list);
    } catch (err) { res.status(500).json({ msg: err.message }); }
  },

  getPackageById: async (req, res) => {
    try {
      const pkg = await Package.findById(req.params.id)
        .populate({ path: "destination", populate: { path: "place", select: "name" } });
      if (!pkg) return res.status(404).json({ msg: "Package not found" });
      res.json(pkg);
    } catch (err) { res.status(500).json({ msg: err.message }); }
  },

  deletePackage: async (req, res) => {
    try {
      const pkg = await Package.findById(req.params.id);
      if (!pkg) return res.status(404).json({ msg: "Not found" });

     
      if (pkg.image) {
        fs.unlink(pkg.image, (err) => { if (err) console.log(err); });
      }

      await Package.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted successfully" });
    } catch (err) { res.status(500).json({ msg: err.message }); }
  }
};

module.exports = pkgCtrl;