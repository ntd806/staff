const bcrypt = require('bcrypt');
const {User} = require('../../models');
const passport = require('passport');
const jwt = require('jsonwebtoken');
var {API} =  require('../../const/api')

async function isValidPassword({ user, password }){
    return await bcrypt.compare(password, user.password, 10);
}

async function login (req, res, next){
    passport.authenticate(
    'login',
    async (err, user, info) => {
        try {
        if (err || !user) {
            console.log(err);
            // return res.json({ message: 'Wrong password or username' });
        }

        req.login(
            user,
            { session: false },
            async (error) => {
            if (error) return next(error);

            const body = {username: user.username };
            const token = jwt.sign({ user: body }, 'TOP_SECRET');

            return res.json({ token });
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
        let {username, employeeId, depId, role} = req.body
        var user = await User.create({ username, password, username, employeeId, depId, role })

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