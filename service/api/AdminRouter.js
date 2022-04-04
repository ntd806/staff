const express = require('express');
const router = express.Router();
const AminService = require('./AminService');

router.get('/admin/profile', AminService.profile);
router.get('/admin/getDetail', AminService.getDetail);
router.post('/admin/detele', AminService.detele);
router.post('/admin/edit', AminService.edit);
router.post('/admin/search', AminService.search);
router.get('/admin/getList', AminService.getList);

module.exports = router;