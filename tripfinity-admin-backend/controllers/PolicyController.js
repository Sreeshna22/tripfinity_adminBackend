const Policy = require("../models/Policy");

const policyCtrl = {

  getPolicies: async (req, res) => {
    try {
      const policy = await Policy.findOne();
      if (!policy) return res.status(404).json({ msg: "No policies found" });
      res.json(policy);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

 
  updatePolicies: async (req, res) => {
    try {
     
      const { type, text } = req.body; 
      
    
      const updateData = {};
      updateData[type] = {
        text: text,
        lastUpdated: Date.now()
      };

    
      const updatedPolicy = await Policy.findOneAndUpdate(
        {}, 
        { $set: updateData }, 
        { upsert: true, returnDocument: 'after' }
      );

      res.json({ msg: "Policy updated successfully", updatedPolicy });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = policyCtrl;