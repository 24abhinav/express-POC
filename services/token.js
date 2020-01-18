(function() {
    const jwt = require('jsonwebtoken');
    require('dotenv').config();
    tokenSecret = process.env.JWT_SECRET;

    createToken = (tokenObject) => {
        return new Promise((res, rej) => { 
            res(jwt.sign(tokenObject, tokenSecret));
        });
    },

    verifyToken = (token) => {
        return new Promise((res, rej) => {
            jwt.verify(token, tokenSecret, (err, result) => {
                if(err) {
                    res({
                        status: 401,
                        message: 'Your Session has been expired! Please Login again'
                    });
                } else {
                    res(null, {
                        result
                    });
                }
            });
        });
    },

    invalidateToken = (token) => {
        // jwt.decode
    },

    module.exports = {
        createToken,
        verifyToken
    }
}());