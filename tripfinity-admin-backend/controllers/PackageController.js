


const Package = require("../models/Package");
const fs = require("fs");
const mongoose = require("mongoose");

const pkgCtrl = {


  

 upsertPackage: async (req, res) => {
    try {
      const { id } = req.params;
      const cleanId = id ? id.trim() : null; 
      let data = { ...req.body };


      

     
      if (data.price === undefined || data.price === null || data.price === "") {
        return res.status(400).json({ msg: "Price per Person is required." });
      }

     

      const numericFields = ['days', 'maxPersons', 'price'];
      for (let field of numericFields) {
        if (data[field] !== undefined) {
          const val = Number(data[field]);
          if (isNaN(val) || val < 1) {
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
            return res.status(400).json({ msg: `${fieldName} must be a valid positive number.` });
          }
        }
      }

  
      if (data.rating !== undefined) {
        const ratingNum = Number(data.rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
          return res.status(400).json({ msg: "Rating must be a number between 1 and 5." });
        }
      }

 
      if (data.itinerary) {
        try {
          data.itinerary = typeof data.itinerary === 'string' 
            ? JSON.parse(data.itinerary) 
            : data.itinerary;
        } catch (e) {
          console.log("Itinerary parse skipped, using raw data");
        }
      }


      if (data.idealFor) {
        try {
          data.idealFor = typeof data.idealFor === 'string' 
            ? JSON.parse(data.idealFor) 
            : data.idealFor;
        } catch (e) {
        
          data.idealFor = data.idealFor.split(",").map(i => i.trim());
        }
      }

      if (cleanId && mongoose.Types.ObjectId.isValid(cleanId)) {
        const existingPackage = await Package.findById(cleanId);
        if (!existingPackage) return res.status(404).json({ msg: "Package not found" });

        if (req.files && req.files.length > 0) {
          const newImagePaths = req.files.map(file => file.path);
          data.images = [...(existingPackage.images || []), ...newImagePaths];
        }

        const updated = await Package.findByIdAndUpdate(
          cleanId, 
          { $set: data }, 
          { returnDocument: 'after', runValidators: true } 
        );
        
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

  getPublishedPackages: async (req, res) => {
    try {
      let query = { isPublished: true };

      if (req.query.type && req.query.type !== 'All') {
        query.type = req.query.type; 
      }

      if (req.query.idealFor) {
        query.idealFor = { $in: [req.query.idealFor] };
      }

      if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
      }

      if (req.query.minDays || req.query.maxDays) {
        query.days = {};
        if (req.query.minDays) query.days.$gte = Number(req.query.minDays);
        if (req.query.maxDays) query.days.$lte = Number(req.query.maxDays);
      }

      const list = await Package.find(query)
        .populate("destination", "name")
        .populate("idealFor", "name")
        .sort("-createdAt");

      res.json(list);
    } catch (err) { 
      res.status(500).json({ msg: "Filtering Error: " + err.message }); 
    }
  },

  getAdminPackages: async (req, res) => {
    try {
      const list = await Package.find()
        .populate("destination", "name")
        .populate("idealFor", "name")
        .sort("-createdAt");
      res.json(list);
    } catch (err) { 
      res.status(500).json({ msg: err.message }); 
    }
  },

  getPackageById: async (req, res) => {
    try {
      const cleanId = req.params.id.trim();
      const pkg = await Package.findById(cleanId)
        .populate("destination")
        .populate("idealFor", "name");
      if (!pkg) return res.status(404).json({ msg: "Package not found" });
      res.json(pkg);
    } catch (err) { 
      res.status(500).json({ msg: err.message }); 
    }
  },

  deletePackage: async (req, res) => {
    try {
      const cleanId = req.params.id.trim();
      const pkg = await Package.findById(cleanId);
      if (!pkg) return res.status(404).json({ msg: "Not found" });

      if (pkg.images && pkg.images.length > 0) {
        pkg.images.forEach(imgPath => {
          if (fs.existsSync(imgPath)) {
            fs.unlink(imgPath, (err) => { if (err) console.error(err); });
          }
        });
      }

      await Package.findByIdAndDelete(cleanId);
      res.json({ msg: "Package deleted" });
    } catch (err) { 
      res.status(500).json({ msg: err.message }); 
    }
  }
};

module.exports = pkgCtrl;