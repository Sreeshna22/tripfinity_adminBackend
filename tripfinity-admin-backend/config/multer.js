

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//      let folder = 'uploads/others';
        
//         if (file.fieldname === 'featuredImage') {
//             folder = 'uploads/destinations';
//         } else if (file.fieldname === 'heroImages') {
//             folder = 'uploads/packages/hero';
//         } else if (file.fieldname === 'itineraryImages') {
//             folder = 'uploads/packages/itinerary';
//         } else if (file.fieldname === 'clientImage') {
//             folder = 'uploads/packages/reviews';
//         }

       
//         if (!fs.existsSync(folder)) {
//             fs.mkdirSync(folder, { recursive: true });
//         }
        
//         cb(null, folder);
//     },
//     filename: (req, file, cb) => {
        
//         cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|webp|gif/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//         return cb(null, true);
//     } else {
//         cb(new Error('Only images (jpeg, jpg, png, webp) are allowed!'), false);
//     }
// };

// const upload = multer({ 
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 } 
// });


// module.exports = {
  
//     singleUpload: upload.single('featuredImage'),
    
    
//     packageUpload: upload.fields([
//         { name: 'heroImages', maxCount: 10 },
//         { name: 'itineraryImages', maxCount: 15 },
//         { name: 'clientImage', maxCount: 5 },
//         { name: 'featuredImage', maxCount: 1 }
//     ])
// };