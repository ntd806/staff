const { Department, Sequelize } = require('../../models')
const checkPermission = require('./PermissionService')
const { API } = require('../../const/api')
const Op = Sequelize.Op

async function add (req, res, next) {
  try {
    const { name } = req.body
    console.log(name)
    await Department.create({ name })

    res.json({
      message: API.SUCCESS,
      code: 200
    })
  } catch (error) {
    console.log(error)
    // return next(error);
  }
}

async function detele (req, res, next) {
  checkPermission.checkPermission(req, res, next)
  try {
    const { id } = req.body
    const count = await Department.destroy({
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

async function edit (req, res, next) {
  try {
    const { id, name } = req.body

    const user = await Department.update(
      { name },
      { where: { id } }
    )

    if (!user) {
      res.json({
        message: API.UPDATE_FAILED.MESSAGE.TEXT,
        userId: id,
        code: API.UPDATE_FAILED.MESSAGE.CODE
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

async function search (req, res, next) {
  const limit = 10
  let offset = 0

  if (req.body.offset) {
    offset = req.body.offset
  }

  try {
    const user = await Department.findAndCountAll({
      limit,
      offset,
      where: {
        [Op.or]: {
          name: {
            [Op.like]: '%' + req.body.name + '%'
          },
          id: {
            [Op.like]: '%' + req.body.id + '%'
          }
        }
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
    const user = await Department.findAndCountAll({
      limit,
      offset,
      where: {
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
  add,
  detele,
  edit,
  search,
  getList
}
