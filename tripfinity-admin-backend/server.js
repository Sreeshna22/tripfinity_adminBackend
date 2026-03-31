

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const cookieParser = require('cookie-parser'); 
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();


app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser()); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/destinations', require("./routes/destinationRoutes"));
app.use('/api/packages', require("./routes/packageRoutes"));
app.use('/api/policy',require("./routes/policyRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));