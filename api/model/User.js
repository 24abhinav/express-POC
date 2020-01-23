(function() {

    const tokenService = require('../services/token');
    const database = require('../services/databse');
    const bcryptService = require('../services/bcrypt');
    const emailService = require('../services/email');
    const internalServerError = { message: 'Internal server error'};


    userSignUp = async (data, response) => {
        const checkDuplicate = await database.checkDuplicate('User', 'email', data.email); // tableName, idetifierName, identifierValue
        if(checkDuplicate) { // true means data found and false means data not found
            response.status(400).send({message: 'User already exist'});
            return;
        }
 
        const hashedPassword = await bcryptService.encryptPassword(data.password);
        if(hashedPassword === null) {
            response.status(500).send(internalServerError);
            return;
        }
        delete data.password;
        data.password = hashedPassword
        const inserData = await database.inserDataToTable('User', data);
        if(inserData === null) {
            response.status(500).send(internalServerError);
        } else {
            response.status(200).send({message: 'SignUp successfull'});
        }
    },

    userLogin = async (data, response) => {
        const userData = await database.fetchDataFromTable('User', `email = '${data.email}'`);
        if(userData.length === 0) {
            response.status(400).send('email/password incorrect');
            return;
        }
        // console.log(userData);
        // console.log(data);
        const checkPassword = await bcryptService.passwordCompare(userData[0].password, data.password);
        if(checkPassword === false) {
            response.status(400).send('email/password incorrect');
            return;
        }
        await tokenService.createToken({
            name: {userData},
            mobile : {userData},
            email: {userData}
        }, response);
        response.status(200).send({message: 'Login successfull'});
    },

    updatePassword = async (data, response) => {
        const userData = await database.checkDuplicate('User', 'email', data.email); // tableName, idetifierName, identifierValue
        if(!userData) {   // true means data found and false means data not found
            response.status(404).send({message: 'Email is not register with us!'});
            return;
        }
        // console.log('userdata---> ', userData);
        const checkPassword = await bcryptService.passwordCompare(userData[0].password, data.password);
        if(!checkPassword) {
            response.status(400).send({message: 'Old password is incorrect'});
            return;
        }
        data.password = await bcryptService.encryptPassword(data.password);
        const updateData = await database.updateTableData('User', data, 'email', data.email);
        if(updateData === null) {
            response.status(500).send(internalServerError);
        } else {
            response.status(200).send({message: 'password Update successfully'});
            // callback(null, updateStatus);
        }
    },

    updateUserDetails = async (data, response) => {
        const userData = await database.checkDuplicate('User', 'email', data.email); // tableName, idetifierName, identifierValue
        if(!userData) {   // true means data found and false means data not found
            response.status(404).send({message: 'Email is not register with us!'})
            return;
        }
        const updatedData = await database.updateTableData('User', data, 'email', data.email);

        if(updatedData === null) {
            response.status(500).send(internalServerError);
        } else {
            response.status(200).send(updatedData);
        }
    },

    getUsers = async (response) => {
        const users = await database.fetchDataFromTable('User', null);
        if(users) {
            response.status(200).send({message: 'User Details fetched successfully', users});
        } else {
            response.status(500).send(internalServerError);
        }
    },

    getUserDetailsByEmail = async (data, response) => {
        const existance = await database.checkDuplicate('User', 'email', data.email);
        if(!existance) {
            response.status(400).send({message: 'User does not exists'})
            return;
        }
        const users = await database.fetchDataFromTable('User', `email = '${data.email}'`);
        if(users) {
            response.status(200).send({message: 'User Details fetched successfully', userDetails : users[0]});
        } else {
            response.status(500).send(internalServerError);
        }
    },

    sendEmailActivationLink = async (emailOptions, response) => {
        link = 'dgndngjkngbjgfnbhh' // make a link

        const mailOptions = {
                from: '',
                to: emailOptions.email,
                subject: emailOptions.subject,
                // html: 'veryvicationLink',
                context: emailOptions,
                text : emailOptions.text,
                // cc : 'abhinav.a@mantralabsglobal.com'
        }
        const result = await emailService.sendEmail(mailOptions);
        if(result === null) {
            response.status(500).send(internalServerError);
        } else {
            response.status(200).send({
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
        sendEmailActivationLink,
    };
}());