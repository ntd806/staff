const express = require('express');
const router = express.Router();
const AminService = require('./AminService');

router.get('/profile', AminService.profile);
router.get('/getDetail', AminService.getDetail);
router.post('/detele', AminService.detele);
router.post('/edit', AminService.edit);
router.post('/search', AminService.search);
router.get('/getList', AminService.getList);

module.exports = router;