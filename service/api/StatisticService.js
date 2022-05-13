const { API } = require('../../const/api')
const { Status, sequelize } = require('../../models')

async function getAllStatus (req, res, next) {
  const sql = 'SELECT employeeId, action, SUM(total) as Total, COUNT(action) as time, action FROM statuses GROUP BY action'
  try {
    const status = await sequelize.query(sql, {
      model: Status,
      mapToModel: true // pass true here if you have any mapped fields
    })

    res.json({
      message: API.SUCCESS,
      data: { status },
      code: 200
    })
  } catch (error) {
    return next(error)
  }
}

// async function getStatus (day) {
//   const now = new Date()
//   let time = null
//   switch (day) {
//     case 'today':
//       time = date.format(now, 'YYYY/MM/DD')
//       break
//     case 'yesterday':
//       time = date.addDays(now, -1)
//       break
//     default:
//       break
//   }

//   const sql = 'SELECT employeeId, action, SUM(total) as Total, COUNT(action) as time, action FROM statuses GROUP BY createdAt::DATE'
//   try {
//     const status = await sequelize.query(sql, {
//       model: Status,
//       mapToModel: true // pass true here if you have any mapped fields
//     })

//     return status
//   } catch (error) {
//     console.log(error)
//   }
// }

module.exports = {
  getAllStatus
  // getStatus
}
