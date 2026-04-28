const Testimonial = require("../models/Testimonial");
const fs = require("fs");

const testimonialCtrl = {
  
  upsertTestimonial: async (req, res) => {
    try {
      const { id } = req.params;
      let data = { ...req.body };

      if (req.file) {
        data.image = req.file.path;
      }

      if (id) {
        const updated = await Testimonial.findByIdAndUpdate(id, data, { new: true });
        return res.json({ msg: "Testimonial updated!", updated });
      }

      const newTestimonial = await Testimonial.create(data);
      res.json({ msg: "Testimonial added successfully!", newTestimonial });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },


  getAdminTestimonials: async (req, res) => {
    try {
      const list = await Testimonial.find().sort("-createdAt");
      res.json(list);
    } catch (err) { res.status(500).json({ msg: err.message }); }
  },


  getPublishedTestimonials: async (req, res) => {
    try {
      const list = await Testimonial.find({ isPublished: true }).sort("-createdAt");
      res.json(list);
    } catch (err) { res.status(500).json({ msg: err.message }); }
  },


  deleteTestimonial: async (req, res) => {
    try {
      const testimonial = await Testimonial.findById(req.params.id);
      if (testimonial?.image) {
        fs.unlink(testimonial.image, (err) => { if (err) console.log(err); });
      }
      await Testimonial.findByIdAndDelete(req.params.id);
      res.json({ msg: "Testimonial deleted successfully" });
    } catch (err) { res.status(500).json({ msg: err.message }); }
  }
};

module.exports = testimonialCtrl;