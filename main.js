(function() {

    const express =  require('express');
    const cookieParser = require('cookie-parser');
    const User = require('./api/model/User');
    const Property = require('./api/model/Property');
    const cookieService = require('./api/services/cookie');
    const pricingModel = require('./api/model/PricingModel');
    const tenantDetails = require('./api/model/tenantDetails');
    const middleWares = require('./api/services/middleWares');
    
    const app = express();
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

    app.post('/update/password', middleWares.tokenAuthorizer() , async (req, res, next) => {
        User.updatePassword(req.body, res);
    });

    app.post('/update/userDetails',middleWares.tokenAuthorizer(), async (req, res) => {
        User.updateUserDetails(req.body, res);
    });

    app.post('/user/details', middleWares.tokenAuthorizer(), async (req, res) => {
        User.getUserDetailsByEmail(req.body, res);
    });

    app.get('/getAll/users', middleWares.tokenAuthorizer(), async (req, res) => {
        User.getUsers(res);
    });

    app.post('/sendEmailActivationLink', (req, res) => {
        User.sendEmailActivationLink(req.body, res);
    });

    app.get('/logout', (req, res) => {
        cookieService.userLogout(res);
    });

    // ------------------------------------------- PROPERTY MODEL -------------------------------------------

    app.post('/add/property', middleWares.tokenAuthorizer(), async (req, res) => {
        Property.addProperty(req.body, res);
    }); 

    app.post('/update/property/details',middleWares.tokenAuthorizer(),  async (req, res) => {
        Property.updatePropertyDetails(req.body, res);
    });

    app.post('/fetch/property/details', middleWares.tokenAuthorizer(), async (req, res) => {
        Property.fetchPropertyDetails(req.body.id, res);
    });
    // ------------------------------------------- Pricing Model  -------------------------------------------

    app.post('/add/pricingModel',middleWares.tokenAuthorizer(), async (req, res) => {
        pricingModel.addPricingModel(req.body, res);
    });

    app.post('/update/pricingModel',middleWares.tokenAuthorizer(), async (req, res) => {
        pricingModel.updatePringModelData(req.body, res);
    });

    // ------------------------------------------- Tenant Details Model  -------------------------------------------

    app.post('/add/tenant', middleWares.tokenAuthorizer(), async (req, res) => {
        tenantDetails.addTenant(req.body, res);
    });

    app.post('/map/tenant',middleWares.tokenAuthorizer(),  async (req, res) =>{
        tenantDetails.propertyTenantAssociation(req.body, res);
    });

    app.post('/delete/tenant/mapping', middleWares.tokenAuthorizer(), async (req, res) => {
        tenantDetails.deletePropertyTenantAssociation(req.body, res);
    });

    // ------------------------------------------- SERVER SETUP  -------------------------------------------
    const serverPort = process.env.PORT;
    app.listen(serverPort, () => {
        console.log(`Express server is running on port ${serverPort}`);
    });

    // ------------------------------------------- Error Handling  -------------------------------------------
    process.on('unhandledRejection', (err) => {
        console.log('Internal Server Error-->', err);
        process.exit(1);
    });

}());