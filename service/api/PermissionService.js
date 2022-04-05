const {User} = require('../../models')
var {AUTHORITY} =  require('../../const/const')

async function checkPermission(req, res, next){
    let email = req.body.email
    const user = await User.findOne({ 
        email: email,
        attributes: {
            exclude: ['password']
        }
    })

    if(user.role === AUTHORITY.EMPLOYEE){
        res.json({
            message: "You do not have a permission",
            code: 401,
        })
    }
}

module.exports = {
    checkPermission
}