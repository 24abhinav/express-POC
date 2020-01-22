(function() {
    const express =  require('express');
    const app = express();
    const User = require('./api/model/User');
    const Property = require('./api/model/Property');

    app.use(express.urlencoded());
    app.use(express.json());

    // -------------------------------  USER MODEL -------------------------------------------
    app.post('/signup', (req, res) => {
        User.userSignUp(req.body, res)
    });

    app.post('/signin', (req, res) => {
        User.userLogin(req.body, res);
    });

    app.post('/update/password', (req, res) => {
        User.updatePassword(req.body, res);
    });

    app.post('/update/userDetails', (req, res) => {
        User.updateUserDetails(req.body, res);
    });

    app.post('/user/details', (req, res) => {
        User.getUserDetailsByEmail(req.body, res);
    });

    app.get('/getAll/users', (req, res) => {
       User.getUsers(res);
    });

    app.post('/sendEmailActivationLink', (req, res) => {
        User.sendEmailActivationLink(req.body, res);
    });

    // ------------------------------- PROPERTY MODEL -------------------------------------------

    app.post('/add/property', (req, res) => {
        console.log(req.body);
        Property.addProperty(req.body, res);
    });
    const serverPort = process.env.PORT;
    app.listen(serverPort, () => {
        console.log(`Express server is running on port ${serverPort}`);
    });

}());