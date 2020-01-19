(function() {
    const express =  require('express');
    const app = express();
    const User = require('./model/User');

    app.use(express.urlencoded());
    app.use(express.json());

    // -------------------------------  USER MODEL -------------------------------------------
    app.post('/signup', (req, res) => {
        User.userSignUp(req.body, (err, result) => {
            (err) ? res.send(err) : res.json(result);
        })
    });

    app.post('/signin', (req, res) => {
        User.userLogin(req.body, (err, result) => {
            (err) ? res.send(err) : res.json(result);
        })
    });

    app.post('/update/password', (req, res) => {
        User.updatePassword(req.body, (err, result) => {
            (err) ? res.send(err) : res.json(result);
        });
    });

    app.post('/update/userDetails', (req, res) => {
        User.updateUserDetails(req.body, (err, result) => {
            (err) ? res.send(err) : res.json(result);
        });
    });

    app.post('/user/details', (req, res) => {
        User.getUserDetailsByEmail(req.body, (err, users) => {
            (err) ? res.send(err) : res.json(users);
        });
    });

    app.get('/getAll/users', (req, res) => {
       User.getUsers(req, (err, users) => {
        (err) ? res.send(err) : res.json(users);
       });
    });

    app.post('/sendEmailActivationLink', (req, res) => {
        User.sendEmailActivationLink(req.body, (err, result) => {
            (err) ? res.send(err) : res.json(result);
        });
    });

    // ------------------------------- END USER MODEL -------------------------------------------


    app.listen(8080, () => {
        console.log('running on port 8080');
    });

}());