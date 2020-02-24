(function() {

    const express =  require('express');
    const cookieParser = require('cookie-parser');
    const User = require('./api/model/User');
    const Property = require('./api/model/Property');
    const cookieService = require('./api/services/cookie');
    const pricingModel = require('./api/model/PricingModel');
    const tenantDetails = require('./api/model/tenantDetails');
    const countryData = require('./api/model/countryData');
    const contact = require('./api/model/Contact');
    const propertyBooking = require('./api/model/propertyEnquiry');
    const investers = require('./api/model/Invester');
    const internalServerError = {message: 'Internal server Error'};

    const middleWares = require('./api/services/middleWares');
    const cors = require('cors');
    const adminPanel = require('./api/Admin Panel/router');
    
    const app = express();
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(cookieParser());

    // For handling all request coming from admin panel
    app.use('/admin', adminPanel);

    // -------------------------------------------  USER MODEL -------------------------------------------
    app.post('/signup', (req, res) => {
        User.userSignUp(req.body, res);
    });

    app.post('/signin', (req, res) => {
        // False indicates that API is getting called for user
        User.userLogin(req.body, false, res);
    });

    app.patch('/update/password', middleWares.tokenAuthorizer() , async (req, res, next) => {
        User.updatePassword(req.body, res);
    });

    app.post('/forgot/password', (req, res, next) => {
        User.forgotPasssword(req.body, res);
    });

    app.patch('/update/userDetails',middleWares.tokenAuthorizer(), async (req, res) => {
        User.updateUserDetails(req.body, res);
    });

    app.get('/user/details', middleWares.tokenAuthorizer(), async (req, res) => {
        User.getUserDetails(req, res);
    });

    app.get('/getAll/users', middleWares.tokenAuthorizer(), async (req, res) => {
        User.getUsers(res);
    });

    app.post('/sendEmailActivationLink', (req, res) => {
        User.sendEmailActivationLink(req.body, req, res);
    });

    app.get('/logout', (req, res) => {
        cookieService.userLogout(res);
    });

    // ------------------------------------------- PROPERTY MODEL -------------------------------------------

    app.get('/fetch/all/country', (req, res) => {
        countryData.fetchCountryList(req, res);
    });

    app.get('/fetch/all/states/:countryId', (req, res) => {
        countryData.fetchStateList(req.params.countryId, res);
    });

    app.get('/fetch/all/city/:stateId', (req, res) => {
        countryData.fetchCityList(req.params.stateId, res);
    });

    // ------------------------------------------- PROPERTY MODEL -------------------------------------------

    app.post('/add/property', middleWares.tokenAuthorizer(), async (req, res) => {
        Property.addProperty(req.body, res);
    }); 

    app.patch('/update/property/details',middleWares.tokenAuthorizer(),  async (req, res) => {
        Property.updatePropertyDetails(req.body, res);
    });

    app.get('/fetch/property/details', middleWares.tokenAuthorizer(), async (req, res) => {
        const propertyDetails = await Property.fetchPropertyDetails(req.cookies.propertyId);
        if(propertyDetails) {
            res.status(200).json(propertyDetails);
        } else {
            res.status(500).send(internalServerError);
        }
    });

    // ------------------------------------------- Contact Model  -------------------------------------------

    app.post('/add/contact/details', (req, res) => {
        contact.addContactDetails(req.body, res);
    });

    app.get('/fetch/contact', (req, res) => {  // Add Admin Token Authorizer
        contact.fetchContactDetails(req, res);
    });

    app.delete('/delete/contact/:id', (req, res) => {  // Add Admin Token Authorizer
        contact.deleteContactDetails(req.params.id, res);
    });

    // ------------------------------------------- Property Booking Model  -------------------------------------------

    app.post('/add/booking/details', middleWares.tokenAuthorizer(),  (req, res) => {
        propertyBooking.addBookingDetails(req.body, res);
    });

    app.get('/fetch/booking/details', (req, res) => {  // Add Admin Token Authorizer
        propertyBooking.fetchBookingDetails(req, res);
    });

    app.delete('/delete/booking/details/:id', (req, res) => {  // Add Admin Token Authorizer
        propertyBooking.deleteBookingDetails(req.params.id, res);
    });

    // ------------------------------------------- Pricing Model  -------------------------------------------

    app.post('/add/pricingModel',middleWares.tokenAuthorizer(), async (req, res) => {
        pricingModel.addPricingModel(req.body, res);
    });

    app.patch('/update/pricingModel',middleWares.tokenAuthorizer(), async (req, res) => {
        pricingModel.updatePringModelData(req.body, res);
    });

    // ------------------------------------------- Tenant Details Model  -------------------------------------------

    app.post('/add/tenant', middleWares.tokenAuthorizer(), async (req, res) => {
        tenantDetails.addTenant(req.body, res);
    });

    app.post('/map/tenant',middleWares.tokenAuthorizer(),  async (req, res) =>{
        tenantDetails.propertyTenantAssociation(req.body, res);
    });

    app.delete('/remove/tenant/mapping', middleWares.tokenAuthorizer(), async (req, res) => {
        tenantDetails.deletePropertyTenantAssociation(req.body, res);
    });

    // ------------------------------------------- API for user Dashboard  -------------------------------------------

    app.get('/fetch/investmentDetailsByUserId/:userId', middleWares.tokenAuthorizer(), async (req, res) => {
        investers.investmentDetailsByUserId(req.params.userId, res);
    });

    // ------------------------------------------- SERVER SETUP  -------------------------------------------
    const serverPort = process.env.PORT;
    app.listen(serverPort, () => {
        // console.log(`Express server is running on port ${serverPort}`);
    });

    // ------------------------------------------- Error Handling  -------------------------------------------
    process.on('unhandledRejection', (err) => {
        console.log('Internal Server Error-->', err);
        process.exit(1);
    });

}());
