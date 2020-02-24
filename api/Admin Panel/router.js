(function() {
    const express = require('express');
    const router = express.Router();

    const database = require('../services/databse');
    const serverError = { message: 'Internal server Error!' };
    const user = require('../model/User');
    const middlewares = require('../services/middleWares');
    const investor = require('../model/Invester');

    // parameter true indicates that API is getting called for Admin
    router.post('/signin', async (req, res, next) => {
        user.userLogin(req.body, true, res);
    });

    router.get('/users', middlewares.tokenAuthorizer(true), async (req, res, next) => {
        user.getUsers(res);
    });

    router.get('/investors', middlewares.tokenAuthorizer(true), async (req, res, next) => {
        investor.fetchAllInvestors(res);
    });

    router.post('/add/investor', middlewares.tokenAuthorizer(true), async (req, res, next) => {
        investor.addInvestor(req.body, res);
    });

    router.get('/fetch/investorByPropertyId/:propertyId', middlewares.tokenAuthorizer(true), (req, res, next) => {
        investor.fetchInveterDetailsByPropertyId(req.params.propertyId, res);
    });

    router.get('/fetch/investmentDetailsByUserId/:userId', middlewares.tokenAuthorizer(true), (req, res, next) => {
        investor.investmentDetailsByUserId(req.params.userId, res);
    });

    module.exports = router;
})();
