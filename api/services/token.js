(function() {
    const jwt = require('jsonwebtoken');
    require('dotenv').config();
    tokenSecret = process.env.JWT_SECRET;
    tokenSecretForAdmin = process.env.JWT_ADMIN_SECRET;

    createToken = (tokenObject, isAdmin, response) => {
        return new Promise((res, rej) => { 
            let token;
            if(isAdmin) {
                token = jwt.sign(tokenObject, tokenSecretForAdmin, {expiresIn: '1h'});
            } else {
                token = jwt.sign(tokenObject, tokenSecret, {expiresIn: '1h'});
            }
            response.cookie('S', token);
            res();
        });
    },

    verifyToken = (token, isAdmin) => {
        return new Promise((res, rej) => {
            if(isAdmin) {
                jwt.verify(token, tokenSecretForAdmin, (err, result) => {
                    res(result);
                });
            } else {
                jwt.verify(token, tokenSecret, (err, result) => {
                    res(result);
                });
            }
        });
    },

    invalidateToken = (token) => {
        // jwt.decode
    },
    decodeToken = async (token) => {
        token = token.split(' ')[0];
        const decodedData = await verifyToken(token);
        return decodedData;
    },

    module.exports = {
        createToken,
        verifyToken,
        decodeToken,
    };
}());