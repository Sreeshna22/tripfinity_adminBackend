


const express = require('express');
const router = express.Router();
const { packageUpload } = require('../middleware/upload');
const packageCtrl = require('../controllers/PackageController');
const { authMiddleware, adminChecker } = require('../middleware/tokenMiddlewares');


router.post('/', authMiddleware, adminChecker, packageUpload, packageCtrl.addPackage); 
router.get('/', authMiddleware, adminChecker, packageCtrl.getAdminPackages);
router.put('/:id', authMiddleware, adminChecker, packageUpload, packageCtrl.updatePackage);
router.delete('/:id', authMiddleware, adminChecker, packageCtrl.deletePackage);

module.exports = router;