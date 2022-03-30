const bcrypt = require('bcrypt');
const {User} = require('../../models');
const passport = require('passport');
const jwt = require('jsonwebtoken');


async function preSignUp({email, password}){
    password = await bcrypt.hash(password, 10);
    return await User.create({ email, password });
}

async function isValidPassword({ user, password }){
    return await bcrypt.compare(password, user.password);
}

async function login (req, res, next){
    passport.authenticate(
    'login',
    async (err, user, info) => {
        try {
        if (err || !user) {
            return res.json({ message: 'Wrong password or username' });
        }

        req.login(
            user,
            { session: false },
            async (error) => {
            if (error) return next(error);

            const body = { _id: user._id, email: user.email };
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

module.exports = {
    preSignUp,
    isValidPassword,
    login,
}