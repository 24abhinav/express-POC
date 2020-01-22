(function() {
    const jwt = require('jsonwebtoken');
    require('dotenv').config();
    tokenSecret = process.env.JWT_SECRET;

    createToken = (tokenObject, response) => {
        return new Promise((res, rej) => { 
            const token = jwt.sign(tokenObject, tokenSecret, {expiresIn: '1h'})
            response.cookie('S', token);
            res();
        });
    },

    verifyToken = (token) => {
        return new Promise((res, rej) => {
            jwt.verify(token, tokenSecret, (err, result) => {
                if(err) {
                    res(false);
                } else {
                    res(true);
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