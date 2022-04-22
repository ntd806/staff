var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
require('dotenv').config()
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELEGRAM_KEY
// const token = '5022072043:AAGdXAwSqVD2kFPjihzJix6sQlobtwglMxw'
const bot = new TelegramBot(token, {polling: true})
require('./bot/Telegram/messages')(bot) // Telegram Bot
const passport = require('passport');
require('./auth/auth');
const routes = require('./service/user/UserRouter');
const secureRoute = require('./service/api/AdminRouter');
const departmentRoute = require('./service/api/DepartmentRouter');
const StatisticRouter = require('./service/api/StatisticRouter');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Anthony",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT"
        },
      }
    }
    ,
    security: [{
      jwt: []
    }],
  },
  apis: ["./service/*/*.js"],
}

const specs = swaggerJsdoc(options);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes);
// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/api/user', passport.authenticate('jwt', { session: false }), secureRoute);
app.use('/api/depart', passport.authenticate('jwt', { session: false }), departmentRoute);
app.use('/api/statistic', passport.authenticate('jwt', { session: false }), StatisticRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
