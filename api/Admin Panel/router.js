(function() {
    const express = require('express');
    const router = express.Router();

    const database = require('../services/databse');
    const serverError = { message: 'Internal server Error!' };
    const user = require('../model/User');
    const middlewares = require('../services/middleWares');

    // url = /admin/users
    // parameter true indicates that API is getting called for Admin

    router.post('/signin', async (req, res, next) => {
        user.userLogin(req.body, true, res);
    });

    router.get('/users', middlewares.tokenAuthorizer(true), async (req, res, next) => {
        user.getUsers(res);
    });

    module.exports = router;
})();
