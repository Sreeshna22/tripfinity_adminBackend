



const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const cookieParser = require('cookie-parser'); 
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();


const allowedOrigins = [
  process.env.CLIENT_URL_1, 
  process.env.CLIENT_URL_2, 
  'http://localhost:5173',  
  'http://localhost:3000'   
];

app.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));


app.use(express.json());
app.use(cookieParser()); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/settingRoutes"));
app.use('/api', require("./routes/destinationRoutes"));
app.use('/api/destinations', require("./routes/destinationRoutes"));
// app.use('/api/packages', require("./routes/packageRoutes"));
app.use("/api", require("./routes/packageRoutes"));

app.use("/api", require("./routes/requestRoutes"));
app.use("/api", require("./routes/testimonialRoutes"));
app.use('/api/policy', require("./routes/policyRoutes"));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));