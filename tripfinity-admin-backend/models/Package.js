





const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  morning: String,
  afternoon: String,
  evening: String,
});

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
   days: { type: String, required: true },
    // days: { type: Number, required: true },
    price: { type: Number, required: true },
    maxPersons: { type: Number, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    shortDescription: String,
    longDescription: String,
    idealFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "Setting" }],
    images: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    itinerary: [itinerarySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);