(function() {
    const tokenService = require('./token');

    setCookie = (name, value, maxAge, response) => {
        response.cookie(name, value, maxAge);
    },

    tokenAuthorization = async (request, response) => {
        const token = await request.cookies.S;

        // console.log('token is here--------------->       ', token);
        if (token !== undefined) {
            const isTokenValid = await tokenService.verifyToken(token);
            if(!isTokenValid) {
                response.status(401).send({message: 'Your Session has been expired! Please Login again'});
                return false;
            } 
        } else {
            response.status(401).send({message: 'Token is missing'});
            return false;
        }
        // console.log('token is valid');
        return true;
    }

    module.exports = {
        setCookie,
        tokenAuthorization
    }
}());