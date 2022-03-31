const express = require('express');
const router = express.Router();
const AminService = require('./AminService');

router.get('/profile', AminService.profile);
router.get('/profile/{id}', AminService.getDetail);
router.post('/detele', AminService.detele);
router.post('/edit', AminService.edit);

module.exports = router;