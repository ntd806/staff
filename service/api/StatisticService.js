const {Status} = require('../../models');

async function getAllStatus(req, res, next){
    let limit = 10
    let offset = 0

    if(req.body.offset) {
        offset = req.query.offset
    }

    try {
        let user =  await Status.findAndCountAll({
            limit: limit,
            offset: offset,
            where: {
           }
        })

        res.json({
            message: API.SUCCESS,
            data: {user},
            code: 200,
        })
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getAllStatus
}