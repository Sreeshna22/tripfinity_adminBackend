

const mongoose = require("mongoose");

const customRequestSchema = new mongoose.Schema({
  requestId: { type: String, unique: true }, 
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  destinationPreference: String,
  peopleCount: Number,
  daysCount: Number,
  budget: Number,
  travelDate: Date,
  specialRequirements: String,
  status: { 
    type: String, 
    enum: ["Pending", "Accepted", "Rejected", "In Progress"], 
    default: "Pending" 
  },
  adminNotes: String
}, { timestamps: true });


customRequestSchema.pre("save", async function() {
  if (!this.requestId) {
    this.requestId = "TRV-" + Math.floor(10000 + Math.random() * 90000);
  }

});

module.exports = mongoose.model("CustomRequest", customRequestSchema);