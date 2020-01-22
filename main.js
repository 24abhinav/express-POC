(function() {
    const express =  require('express');
    const app = express();
    const User = require('./api/model/User');
    const Property = require('./api/model/Property');
    const cookieParser = require('cookie-parser');
    const cookieService = require('./api/services/cookie');

    app.use(express.urlencoded());
    app.use(express.json());
    app.use(cookieParser());

    // -------------------------------------------  USER MODEL -------------------------------------------
    app.post('/signup', (req, res) => {
        User.userSignUp(req.body, res);
    });

    app.post('/signin', (req, res) => {
        User.userLogin(req.body, res);
    });

    app.post('/update/password', async (req, res) => {
        const tokenVerification = await cookieService.tokenAuthorization(req, res);
        if(tokenVerification)
            User.updatePassword(req.body, res);
    });

    app.post('/update/userDetails', async (req, res) => {
        const tokenVerification = await cookieService.tokenAuthorization(req, res);
        if(tokenVerification)
            User.updateUserDetails(req.body, res);
    });

    app.post('/user/details', async (req, res) => {
        const tokenVerification = await cookieService.tokenAuthorization(req, res);
        if(tokenVerification)
            User.getUserDetailsByEmail(req.body, res);
    });

    app.get('/getAll/users', async (req, res) => {
        const tokenVerification = await cookieService.tokenAuthorization(req, res);
        if(tokenVerification)
            User.getUsers(res);
    });

    app.post('/sendEmailActivationLink', (req, res) => {
        User.sendEmailActivationLink(req.body, res);
    });

    // ------------------------------------------- PROPERTY MODEL -------------------------------------------

    app.post('/add/property', async (req, res) => {
        const tokenVerification = await cookieService.tokenAuthorization(req, res);
        if(tokenVerification)
            Property.addProperty(req.body, res);
    });

    app.post('/update/property/details', async (req, res) => {
        const tokenVerification = await cookieService.tokenAuthorization(req, res);
        if(tokenVerification)
            Property.updatePropertyDetails(req.body, res);
    });

    app.post('/fetch/property/details', async (req, res) => {
        const tokenVerification = await cookieService.tokenAuthorization(req, res);
        if(tokenVerification)
            Property.fetchPropertyDetails(req.body, res);
    });

    // ------------------------------------------- SERVER SETUP  -------------------------------------------
    const serverPort = process.env.PORT;
    app.listen(serverPort, () => {
        console.log(`Express server is running on port ${serverPort}`);
    });

}());