const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {

  const adminEmail = process.env.MAIL_USER; 
  const hashed = await bcrypt.hash("123456", 10);

  await User.findOneAndUpdate(
    { email: adminEmail },
    { email: adminEmail, password: hashed, role: "admin" },
    { upsert: true, new: true }
  );

  console.log(`Admin created/updated for: ${adminEmail}`);
  process.exit();
});