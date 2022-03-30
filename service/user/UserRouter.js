const express = require('express');
const UserService = require('./UserService');
const passport = require('passport');
const router = express.Router();

router.post('/signup', passport.authenticate('signup', { session: false }),
async (req, res, next) => {
  res.json({
    message: 'Signup successful',
    user: req.user
  });
});

router.post('/login', UserService.login);

module.exports = router;