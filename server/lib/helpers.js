const bcrypt = require('bcryptjs');
const tago = require('timeago.js');
const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async (password, passwordbd) => {
    try {
        return await bcrypt.compare(password, passwordbd);
    } catch (error) {
        console.log(error);
    }
};

helpers.timeago = fecha => {
    return tago.format(fecha)
}

module.exports = helpers;