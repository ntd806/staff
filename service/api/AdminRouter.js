const express = require('express');
const router = express.Router();
const AminService = require('./AminService');

router.get('/profile', AminService.profile);
router.post('/detele', AminService.detele);

module.exports = router;