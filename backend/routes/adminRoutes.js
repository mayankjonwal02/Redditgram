const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

router.get('/reports', adminController.reviewReports);
router.get('/statistics', adminController.getStatistics);

module.exports = router;
