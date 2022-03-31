const express = require('express');
const router = express.Router();
module.exports = router;const {User, Sequelize} = require('../../models')
var {API} =  require('../../const/api')
var {AUTHORITY} =  require('../../const/const')
const Op = Sequelize.Op;

async function profile(req, res, next) {
    try{
        const username = req.user.username
        const user = await User.findOne({ 
            username: username,
            attributes: {
                exclude: ['password']
            }
        })
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
        let {
            id,
            firstName,
            lastName,
            employeeId,
            depId,
            salary,
            is_block,
            is_delete,
            role,
            phone,
            address,
            email,
            langue,
            birthday,
            onboard,
            quit
        } = req.body
        
        const user = await User.update(
            {
                id,
                firstName,
                lastName,
                employeeId,
                depId,
                salary,
                is_block,
                is_delete,
                role,
                phone,
                address,
                email,
                langue,
                birthday,
                onboard,
                quit
            },
            { where: { id: id } }
          )
        
        if (!user) {
            res.json({
                message: API.UPDATE_FAILED.MESSAGE.TEXT,
                userId: id,
                code: API.UPDATE_FAILED.MESSAGE.CODE,
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

async function search(req, res, next){
    try {
        let user =  await User.findAll({
            where: {
                [Op.or]: {
                    lastName: {
                        [Op.like]: '%'+req.body.lastName+'%'
                    },
                    firstName: {
                        [Op.like]: '%'+req.body.firstName+'%'
                    },
                    id: {
                        [Op.like]: '%'+req.body.id+'%'
                    }
                }
           },
           attributes: {
            exclude: ['password']
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

async function getDetail(req, res, next){
    let id = req.query.id
    try {
        let user =  await User.findOne({
            id,
           attributes: {
            exclude: ['password']
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
    profile,
    detele,
    edit,
    search,
    getDetail
}