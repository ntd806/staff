const express = require('express')
const UserService = require('./UserService')
const router = express.Router()

router.post('/signup', UserService.signup)

router.post('/login', UserService.login)

module.exports = router
