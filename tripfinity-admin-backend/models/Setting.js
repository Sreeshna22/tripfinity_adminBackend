
const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true, 
    enum: ["Place", "DestinationType", "IdealFor", "PriceRange", "DurationRange"] 
  },
  name: { type: String, required: true }, 
  min: { type: Number }, 
  max: { type: Number }, 
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
}, { timestamps: true });

module.exports = mongoose.model("Setting", settingSchema);