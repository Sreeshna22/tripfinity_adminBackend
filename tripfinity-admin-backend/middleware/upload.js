



const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads/others';
        if (file.fieldname === 'featuredImage') folder = 'uploads/destinations';
        else if (file.fieldname === 'heroImages') folder = 'uploads/packages/hero';
        else if (file.fieldname === 'itineraryImages') folder = 'uploads/packages/itinerary';
        else if (file.fieldname === 'imageGallery') folder = 'uploads/packages/gallery';
        else if (file.fieldname === 'clientImage') folder = 'uploads/packages/reviews';

        if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = {
    singleUpload: upload.single('featuredImage'),
    packageUpload: upload.fields([
        { name: 'heroImages', maxCount: 10 },
        { name: 'itineraryImages', maxCount: 15 },
        { name: 'imageGallery', maxCount: 15 },
        { name: 'clientImage', maxCount: 5 }
    ])
};