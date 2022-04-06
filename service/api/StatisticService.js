const {API} =  require('../../const/api')
const {Status, sequelize} = require('../../models');

async function getAllStatus(req, res, next){
    let sql = "SELECT employeeId, action, SUM(total) as Total, COUNT(action) as time, action FROM statuses GROUP BY action"
    try {
        const status = await sequelize.query(sql, {
            model: Status,
            mapToModel: true // pass true here if you have any mapped fields
          });

        res.json({
            message: API.SUCCESS,
            data: {status},
            code: 200,
        })
    } catch (error) {
        return next(error);
    }
}

async function getConditionStatus(day){
    const now = new Date()

    switch(day) {
        case 'today':
            time = date.format(now, 'YYYY/MM/DD HH:mm:ss GMT+08:00')
            break;
        case 'yesterday':
            time = date.addDays(now, -1)
            break;
        default:
            time = date.format(day, 'YYYY/MM/DD HH:mm:ss GMT+08:00')
            break
    }

    let sql = "SELECT employeeId, action, SUM(total) as Total, COUNT(action) as time, action FROM statuses where createdAt = " + time + " GROUP BY action"
    try {
        const status = await sequelize.query(sql, {
            model: Status,
            mapToModel: true // pass true here if you have any mapped fields
          });

        res.json({
            message: API.SUCCESS,
            data: {status},
            code: 200,
        })
    } catch (error) {
        return next(error);
    }
}


module.exports = {
    getAllStatus,
    getConditionStatus
}