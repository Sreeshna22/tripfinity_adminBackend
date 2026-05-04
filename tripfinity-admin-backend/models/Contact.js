const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  travelDate: { type: Date },
  numberOfTravellers: { type: String },
  message: { type: String, required: true },
  status: { type: String, default: "New" }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Contact", contactSchema);