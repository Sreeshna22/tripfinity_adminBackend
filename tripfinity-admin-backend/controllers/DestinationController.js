

const Destination = require('../models/Destination');

exports.addDestination = async (req, res) => {
    try {
        const destinationData = new Destination({
            ...req.body,
            featuredImage: req.file ? req.file.path : null
        });
        await destinationData.save();
        res.status(201).json({ message: "Destination Saved!", data: destinationData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDestinations = async (req, res) => {
    try {
        const data = await Destination.find().sort({ createdAt: -1 });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateToggle = async (req, res) => {
    try {
        const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateDestination = async (req, res) => {
    try {
        let updateData = { ...req.body };
        if (req.file) updateData.featuredImage = req.file.path;
        const updated = await Destination.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' , runValidators: true });
        res.status(200).json({ message: "Updated!", data: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteDestination = async (req, res) => {
    try {
        await Destination.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};