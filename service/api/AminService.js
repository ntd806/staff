const { User, Sequelize } = require('../../models')
const { API } = require('../../const/api')
const Op = Sequelize.Op
const checkPermission = require('./PermissionService')

async function profile (req, res, next) {
  try {
    const username = req.user.username
    const user = await User.findOne({
      username,
      attributes: {
        exclude: ['password']
      }
    })
    res.json({
      message: API.SUCCESS,
      user,
      token: req.get('secret_token'),
      code: 200
    })
  } catch (error) {
    return next(error)
  }
}

async function detele (req, res, next) {
  checkPermission.checkPermission(req, res, next)

  try {
    const id = req.body.userId
    const count = await User.destroy({
      where: {
        id
      }
    })

    if (count !== 1) {
      res.json({
        message: API.DELETE_FAILED.MESSAGE.TEXT,
        userId: id,
        code: API.DELETE_FAILED.MESSAGE.CODE
      })
    }

    res.json({
      message: API.SUCCESS,
      code: 200
    })
  } catch (error) {
    return next(error)
  }
}

// async function edit (req, res, next) {
//   try {
//     const {
//       id,
//       firstName,
//       lastName,
//       employeeId,
//       depId,
//       salary,
//       is_block,
//       is_delete,
//       role,
//       phone,
//       address,
//       email,
//       langue,
//       birthday,
//       onboard,
//       quit
//     } = req.body

//     const user = await User.update(
//       {
//         firstName,
//         lastName,
//         employeeId,
//         depId,
//         salary,
//         is_block,
//         is_delete,
//         role,
//         phone,
//         address,
//         email,
//         langue,
//         birthday,
//         onboard,
//         quit
//       },
//       { where: { id } }
//     )

//     if (!user) {
//       res.json({
//         message: API.UPDATE_FAILED.MESSAGE.TEXT,
//         userId: id,
//         code: API.UPDATE_FAILED.MESSAGE.CODE
//       })
//     }

//     res.json({
//       message: API.SUCCESS,
//       code: 200
//     })
//   } catch (error) {
//     return next(error)
//   }
// }

async function search (req, res, next) {
  const limit = 10
  let offset = 0

  if (req.body.offset) {
    offset = req.body.offset
  }

  try {
    const user = await User.findAndCountAll({
      limit,
      offset,
      where: {
        [Op.or]: {
          lastName: {
            [Op.like]: '%' + req.body.lastName + '%'
          },
          firstName: {
            [Op.like]: '%' + req.body.firstName + '%'
          },
          id: {
            [Op.like]: '%' + req.body.id + '%'
          }
        }
      },
      attributes: {
        exclude: ['password']
      }
    })

    res.json({
      message: API.SUCCESS,
      data: { user },
      code: 200
    })
  } catch (error) {
    return next(error)
  }
}

async function getDetail (req, res, next) {
  const id = req.query.id
  try {
    const user = await User.findOne({
      id,
      attributes: {
        exclude: ['password']
      }
    })

    res.json({
      message: API.SUCCESS,
      data: { user },
      code: 200
    })
  } catch (error) {
    return next(error)
  }
}

async function getList (req, res, next) {
  const limit = 10
  let offset = 0

  if (req.body.offset) {
    offset = req.query.offset
  }

  try {
    const user = await User.findAndCountAll({
      limit,
      offset,
      where: {
      },
      attributes: {
        exclude: ['password']
      }
    })

    res.json({
      message: API.SUCCESS,
      data: { user },
      code: 200
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  profile,
  detele,
  // edit,
  search,
  getDetail,
  getList
}
