const bcrypt = require('bcrypt');
const {User} = require('../../models');
const passport = require('passport');
const jwt = require('jsonwebtoken');
var {API} =  require('../../const/api')

async function isValidPassword({ user, password }){
    return await bcrypt.compare(password, user.password);
}

/**
*  @swagger
*    /login:
*      post:
*        tags:
*        - "login"
*        summary: "Add a new pet to the store"
*        description: ""
*        operationId: "addPet"
*        consumes:
*        - "application/xml"
*        produces:
*        - "application/json"
*        parameters:
*        - in: "body"
*          name: "body"
*          description: "Pet object that needs to be added to the store"
*          required: true
*          schema:
*        responses:
*          "405":
*            description: "Invalid input"
*        security:
*        - petstore_auth:
*          - "write:pets"
*          - "read:pets"
*/
async function login (req, res, next){
    passport.authenticate(
    'login',
    async (err, user, info) => {
        try {
        if (err || !user) {
            console.log(err);
            return res.json({ message: 'Wrong password or username' });
        }

        req.login(
            user,
            { session: false },
            async (error) => {
            if (error) return next(error);

            const body = {email: user.email };
            const token = jwt.sign({ user: body }, 'TOP_SECRET');

            return res.json({ token , email: user.email});
            }
        );
        } catch (error) {
            return next(error);
        }
    }
    )(req, res, next);
}


async function signup(req, res, done){
    try {
        let password = await bcrypt.hash(req.body.password, 10)
        let {email, employeeId, depId, role} = req.body
        var user = await User.create({ email, password, employeeId, depId, role })

        if (!user) {
            res.json({
                message: API.CREATE_FAILED.MESSAGE.TEXT,
                data: {
                    user: {}
                },
                code:API.CREATE_FAILED.MESSAGE.CODE
            })
    
        }

        res.json({
            message: API.SUCCESS,
            data: {
                user: user,
            },
            code:200
        })

    } catch (error) {

      done(error);
    }
}

module.exports = {
    isValidPassword,
    login,
    signup,
}