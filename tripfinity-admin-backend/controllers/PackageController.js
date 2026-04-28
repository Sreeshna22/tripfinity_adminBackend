

const Package = require("../models/Package");
const fs = require("fs");

const pkgCtrl = {
 upsertPackage: async (req, res) => {
  try {
    const { id } = req.params;
    let data = { ...req.body };

    if (data.itinerary) {
      try {
        data.itinerary = typeof data.itinerary === 'string' 
          ? JSON.parse(data.itinerary) 
          : data.itinerary;
        

        data.itinerary.sort((a, b) => a.dayNumber - b.dayNumber);
      } catch (e) {
        return res.status(400).json({ msg: "Invalid format for itinerary." });
      }
    }


    if (data.idealFor) {
      try {
        data.idealFor = typeof data.idealFor === 'string' 
          ? JSON.parse(data.idealFor) 
          : data.idealFor;
      } catch (e) {
  
        data.idealFor = data.idealFor.split(",").map(item => item.trim());
      }
    }


    if (id) {
   
      const existingPackage = await Package.findById(id);
      if (!existingPackage) return res.status(404).json({ msg: "Package not found" });

      if (req.files && req.files.length > 0) {
        const newImagePaths = req.files.map(file => file.path);
       
        data.images = [...existingPackage.images, ...newImagePaths];
      } else {
    
        data.images = existingPackage.images;
      }

      const updated = await Package.findByIdAndUpdate(id, data, { new: true });
      return res.json({ msg: "Package updated successfully", updated });

    } else {

      if (req.files && req.files.length > 0) {
        data.images = req.files.map(file => file.path);
      }
      
      const newPkg = await Package.create(data);
      return res.status(201).json({ msg: "Package created successfully", newPkg });
    }

  } catch (err) {
    console.error("Upsert Error:", err);
    res.status(500).json({ msg: "Server Error: " + err.message });
  }
},

  getAdminPackages: async (req, res) => {
    try {
      const list = await Package.find()
        .populate("destination") 
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
      const pkg = await Package.findById(req.params.id).populate("destination");
      if (!pkg) return res.status(404).json({ msg: "Package not found" });
      res.json(pkg);
    } catch (err) { res.status(500).json({ msg: err.message }); }
  },

  deletePackage: async (req, res) => {
    try {
      const pkg = await Package.findById(req.params.id);
      if (!pkg) return res.status(404).json({ msg: "Not found" });

   
      if (pkg.images && pkg.images.length > 0) {
        pkg.images.forEach(imgPath => {
          if (fs.existsSync(imgPath)) {
            fs.unlink(imgPath, (err) => { if (err) console.log(err); });
          }
        });
      }

      await Package.findByIdAndDelete(req.params.id);
      res.json({ msg: "Package and all associated images deleted" });
    } catch (err) { res.status(500).json({ msg: err.message }); }
  }
};

module.exports = pkgCtrl;