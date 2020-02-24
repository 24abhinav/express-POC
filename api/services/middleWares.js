(function() {
    const tokenService = require('./token');

    tokenAuthorizer = (isAdmin) => {
        return async (request, response, next) => {
            const token = await request.cookies.S;
            if (token) {
                const isTokenValid = await tokenService.verifyToken(token, isAdmin);
                if(!isTokenValid) {
                    response.status(401).send({message: 'Your Session has been expired! Please Login again'});
                } else {
                    next();
                }
            } else {
                response.status(403).send({message: 'Token is missing'});
            }
        }
    },

    module.exports = {
        tokenAuthorizer,
    };

}());
