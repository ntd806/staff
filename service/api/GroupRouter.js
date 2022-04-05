const express = require('express');
const router = express.Router();
const GroupService = require('./GroupService');

router.post('/add', GroupService.add);
router.get('/getDetail', GroupService.getDetail);
router.post('/detele', GroupService.detele);
router.post('/edit', GroupService.edit);
router.post('/search', GroupService.search);
router.get('/getList', GroupService.getList);

module.exports = router;