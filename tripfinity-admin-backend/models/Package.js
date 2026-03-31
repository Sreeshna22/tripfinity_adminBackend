

const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
   
    packageName: { type: String, required: true },
    oneLiner: String,
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
    category: { 
        type: String, 
        enum: ['Couple', 'Family', 'Group', 'Solo', 'Corporate'] 
    },
    duration: String,
    idealFor: { 
        type: String, 
        enum: ['Honeymoon', 'Adventure', 'Nature', 'Pilgrimage', 'Relaxation'] 
    },
    bestTimeToVisit: String,

  
    heroImages: [String],
    packageShortTagline: String,
    price: Number,
    priceLabel: { 
        type: String, 
        enum: ['Price Starting From', 'Fixed Price', 'Offer Price'] 
    },
    priceBasis: { 
        type: String, 
        enum: ['Per Person', 'Per Night', 'Per Couple', 'Full Package'] 
    },
    microCopy: String,

  
    richText: String,
    highlights: [{ title: String, description: String }],

    itinerary: [{
        dayTitle: String,
        description: String,
        bulletPoints: String,
        stay: String,
        dayImage: String
    }],

    inclusions: String,
    exclusions: String,
    imageGallery: [String], 

  
    basePrice: Number,
    seasonalPricing: {
        seasonName: String,
        price: Number,
        dateRange: String,
        pricingNotes: String,
        isPeakSeason: { type: Boolean, default: false },
        isCustomPricing: { type: Boolean, default: false }
    },

    overallRating: Number,
    totalReviewCount: Number,
    reviews: [{
        clientName: String,
        rating: Number,
        comment: String,
        clientImage: String 
    }],

    status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' }
}, { timestamps: true });

module.exports = mongoose.model('Package', PackageSchema);