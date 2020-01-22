(function() {

    const tokenService = require('../services/token');
    const database = require('../services/databse');
    const bcryptService = require('../services/bcrypt');
    const emailService = require('../services/email');
    const internalServerError = { status: 500, message: 'Internal server error'}


    userSignUp = async (data, res) => {
        const checkDuplicate = await database.checkDuplicate('User', 'email', data.email); // tableName, idetifierName, identifierValue
        if(checkDuplicate) { // true means data found and false means data not found
            res.status(400).send('User already exist');
            return;
        }

        const hashedPassword = await bcryptService.encryptPassword(data.password);
        if(hashedPassword === null) {
            res.status(500).send('Internal server error');
            return;
        }
        delete data.password;
        data.password = hashedPassword
        const inserData = await database.inserDataToTable('User', data);
        if(inserData === null) {
            res.status(500).send('Internal server error');
        } else {
            res.status(200).send('SignUp successfull');
        }
    }

    userLogin = async (data, res) => {
        const userData = await database.fetchDataFromTable('User', `email = '${data.email}'`);
        if(userData.length === 0) {
            res.status(400).send('email/password incorrect');
            return;
        }
        // console.log(userData);
        // console.log(data);
        const checkPassword = await bcryptService.passwordCompare(userData[0].password, data.password);
        if(checkPassword === false) {
            res.status(400).send('email/password incorrect');
            return;
        }
        const token = await tokenService.createToken({
            name: {userData},
            mobile : {userData},
            email: {userData}
        });
        res.status(200).send('Login successfull');
    },

    updatePassword = async (data, res) => {
        const userData = await database.checkDuplicate('User', 'email', data.email); // tableName, idetifierName, identifierValue
        if(!userData) {   // true means data found and false means data not found
            res.status(404).send('Email is not register with us!');
            return;
        }
        // console.log('userdata---> ', userData);
        const checkPassword = await bcryptService.passwordCompare(userData[0].password, data.password);
        if(!checkPassword) {
            res.status(400).send('Old password is incorrect');
            return;
        }
        data.password = await bcryptService.encryptPassword(data.password);
        const updateData = await database.updateTableData('User', data, 'email', data.email);
        if(updateData === null) {
            res.status(500).send('Internal Server error');
        } else {
            res.status(200).send({message: 'password Update successfully'});
            // callback(null, updateStatus);
        }
    },

    updateUserDetails = async (data, callback) => {
        const userData = await database.checkDuplicate('User', 'email', data.email); // tableName, idetifierName, identifierValue
        if(!userData) {   // true means data found and false means data not found
            callback({
                status: 404,
                message: 'Email is not register with us!'
            });
            return;
        }
        const updatedData = await database.updateTableData('User', data, 'email', data.email);

        if(updatedData === null) {
            callback(internalServerError);
        } else {
            callback(null, updatedData);
        }
    },

    getUsers = async (data, callback) => {
        const users = await database.fetchDataFromTable('User', null);
        if(users) {
            callback(null, {
                status: 200,
                message: 'User list fetched successfully',
                users
            });
        } else {
            callback(internalServerError);
        }
    },

    getUserDetailsByEmail = async (data, callback) => {
        const existance = await database.checkDuplicate('User', 'email', data.email);
        if(!existance) {
            callback({
                status: 400,
                message: 'User does not exists'
            });
            return;
        }
        const users = await database.fetchDataFromTable('User', `email = '${data.email}'`);
        if(users) {
            callback(null, {
                status: 200,
                message: 'User Details fetched successfully',
                userDetails : users[0]
            });
        } else {
            callback(internalServerError);
        }
    },

    sendEmailActivationLink = async (emailOptions, callback) => {
        link = 'dgndngjkngbjgfnbhh' // make a link

        const mailOptions = {
                from: '',
                to: emailOptions.email,
                subject: emailOptions.subject,
                // html: 'veryvicationLink',
                context: emailOptions,
                text : emailOptions.text,
                cc : 'abhinav.a@mantralabsglobal.com'
        }
        const result = await emailService.sendEmail(mailOptions);
        if(result === null) {
            callback({
                status: 500,
                message: 'Internal Server Error'
            });
        } else {
            callback({
                status: 200,
                message: `Activation link sent successfully to ${emailOptions.email}`
            });
        }
    },

    module.exports = {
        userLogin,
        userSignUp,
        getUsers, 
        updatePassword,
        updateUserDetails,
        getUserDetailsByEmail,
        sendEmailActivationLink
    }
}())