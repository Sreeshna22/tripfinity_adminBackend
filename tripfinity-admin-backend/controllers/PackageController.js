


const Package = require('../models/Package');


exports.addPackage = async (req, res) => {
    try {
        const files = req.files;
        
       
        const itinerary = JSON.parse(req.body.itinerary || "[]");
        const reviews = JSON.parse(req.body.reviews || "[]");
        const highlights = JSON.parse(req.body.highlights || "[]");
        const seasonalPricing = JSON.parse(req.body.seasonalPricing || "{}");

        const heroImages = files['heroImages'] ? files['heroImages'].map(f => f.path) : [];
        const imageGallery = files['imageGallery'] ? files['imageGallery'].map(f => f.path) : [];

       
        if (files['itineraryImages']) {
            files['itineraryImages'].forEach((file, index) => {
                if (itinerary[index]) itinerary[index].dayImage = file.path;
            });
        }

        if (files['clientImage']) {
            files['clientImage'].forEach((file, index) => {
                if (reviews[index]) reviews[index].clientImage = file.path;
            });
        }

        const newPackage = new Package({
            ...req.body,
            heroImages,
            imageGallery,
            itinerary,
            reviews,
            highlights,
            seasonalPricing
        });

        await newPackage.save();
        res.status(201).json({ message: "Package Published!", data: newPackage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const files = req.files;
       
        let updateData = { ...req.body };

        const itinerary = req.body.itinerary ? JSON.parse(req.body.itinerary) : [];
        const reviews = req.body.reviews ? JSON.parse(req.body.reviews) : [];
        const highlights = req.body.highlights ? JSON.parse(req.body.highlights) : [];
        const seasonalPricing = req.body.seasonalPricing ? JSON.parse(req.body.seasonalPricing) : {};

       
        if (files && files['heroImages']) {
            updateData.heroImages = files['heroImages'].map(f => f.path);
        }
        
        if (files && files['imageGallery']) {
            updateData.imageGallery = files['imageGallery'].map(f => f.path);
        }

        
        if (files && files['itineraryImages']) {
            files['itineraryImages'].forEach((file, index) => {
                if (itinerary[index]) {
                    itinerary[index].dayImage = file.path;
                }
            });
        }

        if (files && files['clientImage']) {
            files['clientImage'].forEach((file, index) => {
                if (reviews[index]) {
                    reviews[index].clientImage = file.path;
                }
            });
        }

      
        updateData.itinerary = itinerary;
        updateData.reviews = reviews;
        updateData.highlights = highlights;
        updateData.seasonalPricing = seasonalPricing;

     
        const updated = await Package.findByIdAndUpdate(
            id, 
            { $set: updateData }, 
            { returnDocument: 'after', runValidators: true }
        );

        if (!updated) return res.status(404).json({ message: "Package not found" });

        res.status(200).json({ message: "Updated Successfully", data: updated });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: error.message });
    }
};


exports.getAdminPackages = async (req, res) => {
    try {
        const data = await Package.find().populate('destination').sort({ createdAt: -1 });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePackage = async (req, res) => {
    try {
        await Package.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPublicPackages = async (req, res) => {
    try {
        const data = await Package.find({ status: 'Published' })
            .populate('destination')
            .sort({ createdAt: -1 });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};