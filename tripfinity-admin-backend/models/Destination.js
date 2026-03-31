const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    
    destinationName: { type: String, required: true }, 
    destination: { type: String, required: true }, 
    category: { 
        type: String, 
        enum: ['Couple', 'Family', 'Group', 'Adventure'], 
        required: true 
    },
    shortOneLiner: String,
    duration: String,
    price: Number,
    priceLabel: { 
        type: String, 
        enum: ['Per Person', 'Per Couple', 'Total Package'], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Published', 'Draft'], 
        default: 'Draft' 
    },
    
    isPopular: { type: Boolean, default: false },
    showOnHomePage: { type: Boolean, default: false },
    
    featuredImage: String 
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);


