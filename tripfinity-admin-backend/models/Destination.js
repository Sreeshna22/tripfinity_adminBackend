
const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  place: { type: mongoose.Schema.Types.ObjectId, ref: "Setting" }, 
  type: { type: mongoose.Schema.Types.ObjectId, ref: "Setting" },  
  shortDescription: String,
  longDescription: String,
  idealFor: [String], 
  coverImage: String,
  galleryImages: [String],
  isPublished: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Destination", destinationSchema);