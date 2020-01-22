(function() {
    const bcrypt = require('bcrypt');

    encryptPassword = (password) => {
        return new Promise((res, rej) => {
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if(err) {
                    res(null);
                } else {
                    // console.log('hashedpassword------->', hashedPassword);
                    res(hashedPassword);
                }
            })
        })
    },
    passwordCompare = (encryptPassword, password) => {
        console.log(encryptPassword)
        console.log(password)
        return new Promise((res, rej) => {
            bcrypt.compare(password, encryptPassword, (err, result) => {
                // console.log('result--->', result);
                // console.log('error--->', err);
                res(result);
            });
        });
    }
    module.exports = {encryptPassword, passwordCompare}
}());