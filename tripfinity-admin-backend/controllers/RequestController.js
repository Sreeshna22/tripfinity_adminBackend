


const CustomRequest = require("../models/CustomRequest");

const requestCtrl = {

  submitRequest: async (req, res) => {
    try {
      const newRequest = await CustomRequest.create(req.body);
      res.status(201).json({ 
        success: true,
        msg: "Your custom travel request has been submitted!", 
        requestId: newRequest.requestId 
      });
    } catch (err) { 
      res.status(500).json({ success: false, msg: err.message }); 
    }
  },


  getAdminRequests: async (req, res) => {
    try {
      const list = await CustomRequest.find().sort("-createdAt");
      res.json(list);
    } catch (err) { 
      res.status(500).json({ msg: err.message }); 
    }
  },


  updateStatus: async (req, res) => {
    try {
      const { status, adminNotes } = req.body;
      const updated = await CustomRequest.findByIdAndUpdate(
        req.params.id, 
        { status, adminNotes }, 
        { new: true }
      );
      
      if (!updated) return res.status(404).json({ msg: "Request not found" });
      
      res.json({ msg: "Status updated successfully", updated });
    } catch (err) { 
      res.status(500).json({ msg: err.message }); 
    }
  }
};

module.exports = requestCtrl;