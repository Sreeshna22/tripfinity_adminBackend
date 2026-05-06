


const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true, 
    enum: ["Place", "DestinationType", "IdealFor", "PriceRange", "DurationRange"] 
  },
  name: { type: String, required: true, trim: true }, 
  min: { type: Number, default: 0 }, 
  max: { type: Number, default: 0 }, 
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
}, { timestamps: true });


settingSchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Setting", settingSchema);