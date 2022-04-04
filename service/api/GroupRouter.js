const express = require('express');
const router = express.Router();
const GroupService = require('./GroupService');

router.get('/group/getDetail', GroupService.getDetail);
router.post('/group/detele', GroupService.detele);
router.post('/group/edit', GroupService.edit);
router.post('/group/search', GroupService.search);
router.get('/group/getList', GroupService.getList);

module.exports = router;