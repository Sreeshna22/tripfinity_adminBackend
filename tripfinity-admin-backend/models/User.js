const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: {
    type: String,
    default: "admin"
  },
  isBlocked: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("User", userSchema);