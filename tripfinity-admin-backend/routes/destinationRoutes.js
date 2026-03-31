


const express = require('express');
const router = express.Router();
const { singleUpload } = require('../middleware/upload'); 
const destController = require('../controllers/DestinationController');
const { authMiddleware, adminChecker } = require('../middleware/tokenMiddlewares');


router.post('/', authMiddleware, adminChecker, singleUpload, destController.addDestination);


router.get('/', destController.getDestinations);

router.patch('/:id', authMiddleware, adminChecker, destController.updateToggle);
router.put('/:id', authMiddleware, adminChecker, singleUpload, destController.updateDestination);
router.delete('/:id', authMiddleware, adminChecker, destController.deleteDestination);

module.exports = router;