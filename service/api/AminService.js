const {User} = require('../../models')
var {API} =  require('../../const/api')

async function profile(req, res, next) {
    try{
        const email = req.user.email
        const user = await User.findOne({ email })
        res.json({
            message: API.SUCCESS,
            user: user,
            token: req.get('secret_token'),
            code:200
        })
    }catch (error) {
        return next(error);
    }
}

async function detele(req, res, next){
    try {
        const id = req.body.userId
        const count = await User.destroy({
            where: {
                id: id
            }
        })
        
        if (count != 1) {
            res.json({
                message: API.DELETE_FAILED.MESSAGE.TEXT,
                userId: id,
                code: API.DELETE_FAILED.MESSAGE.CODE,
            })
        }

        res.json({
            message: API.SUCCESS,
            code:200
        })

    } catch (error) {
        return next(error);
    }
}

async function edit(req, res, next){
    try {
        
    } catch (error) {
        return next(error);
    }
}

async function search(req, res, next){
    try {
        
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    profile,
    detele,
    edit,
    search
}