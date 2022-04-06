const {API} =  require('../../const/api')
const {Status, sequelize} = require('../../models');

async function getAllStatus(req, res, next){
    let limit = 10
    let offset = 0

    if(req.body.offset) {
        offset = req.query.offset
    }

    let sql = "SELECT employeeId, action, SUM(total) as Total,action FROM statuses GROUP BY action"
    try {
        const users = await sequelize.query(sql, {
            model: Status,
            mapToModel: true // pass true here if you have any mapped fields
          });

        console.log(users);
          
        res.json({
            message: API.SUCCESS,
            code: 200,
        })
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getAllStatus
}