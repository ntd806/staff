const { User } = require('../../models')
const { AUTHORITY } = require('../../const/const')

async function checkPermission (req, res, next) {
  const email = req.body.email
  const user = await User.findOne({
    email,
    attributes: {
      exclude: ['password']
    }
  })

  if (user.role === AUTHORITY.EMPLOYEE) {
    res.json({
      message: 'You do not have a permission',
      code: 401
    })
  }
}

module.exports = {
  checkPermission
}
