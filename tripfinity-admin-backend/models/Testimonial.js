const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["Couple", "Family", "Friends"], 
    required: true 
  },
  place: { type: String, required: true }, 
  image: { type: String }, 
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Testimonial", testimonialSchema);