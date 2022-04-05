const express = require('express');
const router = express.Router();
const StatisticService = require('./StatisticService');

router.get('/add', StatisticService.add);
router.post('/detele', StatisticService.detele);
router.post('/edit', StatisticService.edit);
router.post('/search', StatisticService.search);
router.get('/getList', StatisticService.getList);

module.exports = router;