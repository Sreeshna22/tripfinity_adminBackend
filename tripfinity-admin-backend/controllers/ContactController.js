const Contact = require("../models/Contact.js");

const contactCtrl = {

  submitForm: async (req, res) => {
    try {
      const { firstName, lastName, email, mobileNumber, travelDate, numberOfTravellers, message } = req.body;

      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        return res.status(400).json({ msg: "Names should only contain alphabetic characters." });
      }

    
      const mobileRegex = /^[0-9]+$/;
      if (!mobileRegex.test(mobileNumber)) {
        return res.status(400).json({ msg: "Mobile number must contain only digits." });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: "Please provide a valid email address with a proper domain (e.g., .com)." });
      }

  
      if (travelDate) {
        const selectedDate = new Date(travelDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        if (selectedDate < today) {
          return res.status(400).json({ msg: "Travel date cannot be in the past." });
        }
      }

   
      const newRequest = new Contact({
        firstName,
        lastName,
        email,
        mobileNumber,
        travelDate,
        numberOfTravellers,
        message
      });

      await newRequest.save();
      res.status(201).json({ msg: "Request submitted successfully!" });

    } catch (err) {
    
      res.status(500).json({ msg: "Server Error: " + err.message });
    }
  },


  getAllRequests: async (req, res) => {
    try {
      const requests = await Contact.find().sort("-createdAt");
      res.json(requests);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = contactCtrl;