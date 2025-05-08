const express = require('express');
const creditController = require('../controllers/creditController');
const router = express.Router();

router.post('/add', creditController.addCredits);
router.post('/spend', creditController.spendCredits);

module.exports = router;
