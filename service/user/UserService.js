const bcrypt = require('bcrypt');
const {User} = require('../../models');

async function signUp({email, password}){
    password = await bcrypt.hash(password, 10);
    return await User.create({ email, password });
}

async function isValidPassword({ user, password }){
    return await bcrypt.compare(password, user.password);
}

module.exports = {
    signUp,
    isValidPassword
}