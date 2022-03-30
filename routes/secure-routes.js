const express = require('express');
const router = express.Router();
const {User} = require('../models');

router.get(
  '/profile',
  async (req, res, next) => {
    try{
      const email = req.user.email
      const user = await User.findOne({ email })
      res.json({
        message: 'You made it to the secure route',
        user: user,
        token: req.get('secret_token')
      })
    }catch (error) {
        return next(error);
    }
  }
);

module.exports = router;