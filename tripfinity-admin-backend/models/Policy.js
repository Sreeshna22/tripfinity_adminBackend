const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  privacyPolicy: {
    text: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now }
  },
  cancellationPolicy: {
    text: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now }
  },
  termsConditions: {
    text: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now }
  }
}, { timestamps: true });

module.exports = mongoose.model("Policy", policySchema);