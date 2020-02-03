(function() {
    const bcrypt = require('bcrypt');

    encryptPassword = (password) => {
        return new Promise((res, rej) => {
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                res(hashedPassword)
            })
        })
    },
    passwordCompare = (encryptPassword, password) => {
        console.log(encryptPassword)
        console.log(password)
        return new Promise((res, rej) => {
            bcrypt.compare(password, encryptPassword, (err, result) => {
                res(result);
            });
        });
    },

    module.exports = {
        encryptPassword,
        passwordCompare,
    };
}());