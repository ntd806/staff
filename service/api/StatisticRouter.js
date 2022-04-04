const express = require('express');
const router = express.Router();
const StatisticService = require('./StatisticService');

router.get('/depart/getDetail', StatisticService.getDetail);
router.post('/depart/detele', StatisticService.detele);
router.post('/depart/edit', StatisticService.edit);
router.post('/depart/search', StatisticService.search);
router.get('/depart/getList', StatisticService.getList);

module.exports = router;