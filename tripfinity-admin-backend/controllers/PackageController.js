







const Package = require("../models/Package");
const Destination = require("../models/Destination");
const fs = require("fs");
const mongoose = require("mongoose");

const pkgCtrl = {};


 
const parseMaybeJson = (value) => {
  if (value === undefined || value === null || value === "" || value === "undefined") return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
 
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  return value;
};


pkgCtrl.upsertPackage = async (req, res) => {

  let uploadedFiles = [];
  if (req.files) {
    uploadedFiles = Array.isArray(req.files) ? req.files : (req.files.images || []);
  }

  try {
    const { id } = req.params;
    const cleanId = id && id !== "undefined" ? id.trim() : null;
    const data = { ...req.body };

    const requiredFields = ["title", "destination", "days", "price", "maxPersons"];
    for (const field of requiredFields) {
      if (!data[field] || data[field] === "undefined" || data[field] === "") {
        return res.status(400).json({ msg: `${field.charAt(0).toUpperCase() + field.slice(1)} is required.` });
      }
    }

  
    const titleRegex = new RegExp(`^${data.title.trim()}$`, "i");
    const duplicateQuery = { title: { $regex: titleRegex } };
    if (cleanId && mongoose.Types.ObjectId.isValid(cleanId)) {
      duplicateQuery._id = { $ne: cleanId };
    }
    const isDuplicate = await Package.findOne(duplicateQuery);
    if (isDuplicate) {
      return res.status(409).json({ msg: `A package with the title "${data.title}" already exists.` });
    }


    if (!mongoose.Types.ObjectId.isValid(data.destination)) {
      return res.status(400).json({ msg: "Invalid Destination selection. Please select a valid destination." });
    }

 
    const numericFields = ["maxPersons", "price", "days"];
    for (const field of numericFields) {
      const val = Number(data[field]);
      if (isNaN(val) || val < 1) {
        return res.status(400).json({ msg: `${field.charAt(0).toUpperCase() + field.slice(1)} must be a positive number.` });
      }
      data[field] = val; 
    }


    if (data.rating !== undefined && data.rating !== "") {
      const ratingNum = Number(data.rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ msg: "Rating must be a number between 1 and 5." });
      }
      data.rating = ratingNum;
    }


    data.itinerary = parseMaybeJson(data.itinerary);
    data.idealFor = parseMaybeJson(data.idealFor);

    if (Array.isArray(data.itinerary)) {
      data.itinerary = data.itinerary.map((day, index) => ({
        dayNumber: Number(day.dayNumber) || index + 1,
        morning: day.morning || "",
        afternoon: day.afternoon || "",
        evening: day.evening || ""
      }));
    }


    const imagePaths = uploadedFiles.map(file => file.path);


    if (cleanId && mongoose.Types.ObjectId.isValid(cleanId)) {
      const existingPackage = await Package.findById(cleanId);
      if (!existingPackage) return res.status(404).json({ msg: "Package not found in database." });

      if (imagePaths.length > 0) {
        data.images = [...(existingPackage.images || []), ...imagePaths];
      }

      const updated = await Package.findByIdAndUpdate(cleanId, { $set: data }, { new: true, runValidators: true })
        .populate("destination", "name")
        .populate("idealFor", "name");

      return res.json({ msg: "Package updated successfully", updated });
    } 

    if (imagePaths.length > 0) {
      data.images = imagePaths;
    }

    const newPkg = await Package.create(data);
    const populatedPkg = await Package.findById(newPkg._id)
      .populate("destination", "name")
      .populate("idealFor", "name");

    return res.status(201).json({ msg: "Package created successfully", newPkg: populatedPkg });

  } catch (err) {

    uploadedFiles.forEach(file => {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });

    console.error("UPSERT_ERROR:", err);
    return res.status(500).json({ msg: "Server Error: " + (err.message || "Unknown error occurred") });
  }
};


pkgCtrl.getPublishedPackages = async (req, res) => {
  try {
    const list = await Package.find({ isPublished: true })
      .populate("destination", "name")
      .populate("idealFor", "name")
      .sort("-createdAt");
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching published packages: " + err.message });
  }
};


pkgCtrl.getAdminPackages = async (req, res) => {
  try {
    const list = await Package.find()
      .populate("destination", "name")
      .populate("idealFor", "name")
      .sort("-createdAt");
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching admin packages: " + err.message });
  }
};


pkgCtrl.getPackageById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "The provided ID format is invalid." });
    }
    const pkg = await Package.findById(req.params.id)
      .populate("destination", "name")
      .populate("idealFor", "name");
    
    if (!pkg) return res.status(404).json({ msg: "Package not found." });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching package: " + err.message });
  }
};


pkgCtrl.deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "Invalid ID." });

    const pkg = await Package.findById(id);
    if (!pkg) return res.status(404).json({ msg: "Package not found." });

  
    if (pkg.images && pkg.images.length > 0) {
      pkg.images.forEach((img) => {
        if (fs.existsSync(img)) fs.unlinkSync(img);
      });
    }

    await Package.findByIdAndDelete(id);
    res.json({ msg: "Package and its images deleted successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting package: " + err.message });
  }
};

module.exports = pkgCtrl;