



const Package = require("../models/Package");
const Destination = require("../models/Destination");
const fs = require("fs");
const mongoose = require("mongoose");

const pkgCtrl = {};

// helper: safely parse JSON or CSV string
const parseMaybeJson = (value) => {
  if (value === undefined || value === null || value === "") return value;

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

// helper: get uploaded file paths
const getFilePaths = (files) => {
  if (!files) return [];

  // if multer uses upload.array("images")
  if (Array.isArray(files)) {
    return files.map((file) => file.path);
  }

  // if multer uses upload.fields({ images: [...] })
  if (files.images && Array.isArray(files.images)) {
    return files.images.map((file) => file.path);
  }

  return [];
};

pkgCtrl.upsertPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id ? id.trim() : null;
    const data = { ...req.body };

    if (!data.title || !data.destination || !data.days || !data.price || !data.maxPersons) {
      return res.status(400).json({
        msg: "title, destination, days, price, and maxPersons are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(data.destination)) {
      return res.status(400).json({ msg: "Invalid destination id." });
    }

    const numericFields = ["days", "maxPersons", "price"];
    for (const field of numericFields) {
      const val = Number(data[field]);
      if (isNaN(val) || val < 1) {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        return res.status(400).json({
          msg: `${fieldName} must be a valid positive number.`,
        });
      }
      data[field] = val;
    }

    if (data.rating !== undefined && data.rating !== "") {
      const ratingNum = Number(data.rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({
          msg: "Rating must be a number between 1 and 5.",
        });
      }
      data.rating = ratingNum;
    }

    data.itinerary = parseMaybeJson(data.itinerary);
    data.idealFor = parseMaybeJson(data.idealFor);

    if (data.itinerary && !Array.isArray(data.itinerary)) {
      return res.status(400).json({ msg: "Itinerary must be an array." });
    }

    if (data.idealFor && !Array.isArray(data.idealFor)) {
      data.idealFor = [data.idealFor];
    }

    if (Array.isArray(data.itinerary)) {
      data.itinerary = data.itinerary.map((day) => ({
        dayNumber: Number(day.dayNumber),
        morning: day.morning || "",
        afternoon: day.afternoon || "",
        evening: day.evening || "",
      }));

      for (const day of data.itinerary) {
        if (isNaN(day.dayNumber) || day.dayNumber < 1) {
          return res.status(400).json({
            msg: "Each itinerary item must have a valid dayNumber.",
          });
        }
      }
    }

    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map((file) => file.path);
    }

    // UPDATE
    if (cleanId && mongoose.Types.ObjectId.isValid(cleanId)) {
      const existingPackage = await Package.findById(cleanId);
      if (!existingPackage) {
        return res.status(404).json({ msg: "Package not found" });
      }

      if (uploadedImages.length > 0) {
        data.images = [...(existingPackage.images || []), ...uploadedImages];
      }

      const updated = await Package.findByIdAndUpdate(
        cleanId,
        { $set: data },
        { new: true, runValidators: true }
      )
        .populate("destination", "name -_id")
        .populate("idealFor", "name -_id");

      return res.json({
        msg: "Package updated successfully",
        updated,
      });
    }

    // CREATE
    if (uploadedImages.length > 0) {
      data.images = uploadedImages;
    }

    const newPkg = await Package.create(data);

    const populatedPkg = await Package.findById(newPkg._id)
      .populate("destination", "name -_id")
      .populate("idealFor", "name -_id");

    return res.status(201).json({
      msg: "Package created successfully",
      newPkg: populatedPkg,
    });
  } catch (err) {
    console.error("Upsert Error:", err);
    return res.status(500).json({ msg: "Server Error: " + err.message });
  }
};

pkgCtrl.getPublishedPackages = async (req, res) => {
  try {
    let query = { isPublished: true };

    if (req.query.destination) {
      query.destination = req.query.destination;
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
      .populate("destination", "name -_id")
      .populate("idealFor", "name -_id")
      .sort("-createdAt");

    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: "Filtering Error: " + err.message });
  }
};

pkgCtrl.getAdminPackages = async (req, res) => {
  try {
    const list = await Package.find()
      .populate("destination", "name -_id")
      .populate("idealFor", "name -_id")
      .sort("-createdAt");

    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

pkgCtrl.getPackageById = async (req, res) => {
  try {
    const cleanId = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      return res.status(400).json({ msg: "Invalid package id." });
    }

    const pkg = await Package.findById(cleanId)
      .populate("destination", "name -_id")
      .populate("idealFor", "name -_id");

    if (!pkg) return res.status(404).json({ msg: "Package not found" });

    res.json(pkg);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

pkgCtrl.deletePackage = async (req, res) => {
  try {
    const cleanId = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      return res.status(400).json({ msg: "Invalid package id." });
    }

    const pkg = await Package.findById(cleanId);
    if (!pkg) return res.status(404).json({ msg: "Not found" });

    if (pkg.images && pkg.images.length > 0) {
      pkg.images.forEach((imgPath) => {
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      });
    }

    await Package.findByIdAndDelete(cleanId);
    res.json({ msg: "Package deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = pkgCtrl;