const bcrypt = require('bcrypt')
const { User } = require('../../models')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const { API } = require('../../const/api')

async function isValidPassword ({ user, password }) {
  return await bcrypt.compare(password, user.password)
}

/**
 * @swagger
 * paths:
 *   /login:
 *    post:
 *      summary: generates token
 *      description: ''
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *         - name: email
 *           type: string
 *           in: formData
 *           default: test@gmail.com
 *         - name: password
 *           type: string
 *           in: formData
 *           default: 123456
 *      responses:
 *        '200':
 *          description: Sample response
 *
 */
async function login (req, res, next) {
  passport.authenticate(
    'login',
    async (err, user, info) => {
      try {
        if (err || !user) {
          console.log(err)
          return res.json({ message: 'Wrong password or username' })
        }

        req.login(
          user,
          { session: false },
          async (error) => {
            if (error) return next(error)

            const body = { email: user.email }
            const token = jwt.sign({ user: body }, process.env.SECRET_KEY)

            return res.json({ token, email: user.email })
          }
        )
      } catch (error) {
        return next(error)
      }
    }
  )(req, res, next)
}

/**
 * @swagger
 * paths:
 *   /signup:
 *    post:
 *      summary: generates token
 *      description: ''
 *      type: object
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *         - name: email
 *           type: string
 *           in: formData
 *           default: test@gmail.com
 *         - name: password
 *           type: string
 *           in: formData
 *           default: 123456
 *         - name: role
 *           type: string
 *           in: formData
 *           default: CUSTOMER
 *         - name: employeeId
 *         - name: depId
 *      responses:
 *        '200':
 *          description: Sample response
 *
 */
async function signup (req, res, done) {
  try {
    const password = await bcrypt.hash(req.body.password, 10)
    const { email, employeeId, depId } = req.body
    const user = await User.create({ email, password, employeeId, depId })

    if (!user) {
      res.json({
        message: API.CREATE_FAILED.MESSAGE.TEXT,
        data: {
          user: {}
        },
        code: API.CREATE_FAILED.MESSAGE.CODE
      })
    }

    res.json({
      message: API.SUCCESS,
      data: {
        user
      },
      code: 200
    })
  } catch (error) {
    done(error)
  }
}

module.exports = {
  isValidPassword,
  login,
  signup
}
