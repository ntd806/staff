const express = require('express');
const router = express.Router();
const StatisticService = require('./StatisticService');

router.get('/getAllStatus', StatisticService.getAllStatus);

module.exports = router;