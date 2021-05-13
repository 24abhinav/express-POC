(function() {

    const tokenService = require('../services/token');
    const database = require('../services/database');
    const bcryptService = require('../services/bcrypt');
    const emailService = require('../services/email');
    const emailTemplates = require('../../views/emailTemplates');
    const internalServerError = { message: 'Internal server error'};


    userSignUp = async (data, response) => {
        const checkDuplicate = await database.checkDuplicate('User', 'email', data.email); // tableName, identifierName, identifierValue
        if(checkDuplicate) { // true means data found and false means data not found
            response.status(409).send({message: 'User already exist'});
            return;
        }
 
        const hashedPassword = await bcryptService.encryptPassword(data.password);
        if(!hashedPassword) {
            response.status(500).send(internalServerError);
            return;
        }
        data.password = hashedPassword
        const insertData = await database.insertDataToTable('User', data);
        if(insertData) {
            const mailOptions = {
                subject: 'Email activation link',
                from: '',
                to: data.email,
                html: emailTemplates.activateAccount(data, 'facebook.com/activate/account')
            };
            const sendEmailActivationLink = await emailService.sendEmail(mailOptions);
            if(sendEmailActivationLink) {
                response.status(200).send({message: 'SignUp successful'});
            } else {
                response.status(700).send(internalServerError);
            }
        } else {
            response.status(500).send(internalServerError);
        }
    },

    userLogin = async (data, isAdmin, response) => {
        const userData = await database.fetchDataFromTable('User', `email = '${data.email}'`);
        if(userData.length === 0) {
            response.status(400).send({message: 'email or password incorrect'});
            return;
        }

        const checkPassword = await bcryptService.passwordCompare(userData[0].password, data.password);
        if(checkPassword === false) {
            response.status(400).send({message: 'email or password incorrect'});
            return;
        }
        await tokenService.createToken({
            name: userData[0].name,
            mobile : userData[0].mobile,
            email: userData[0].email,
            userId: userData[0].id,
        }, isAdmin, response);
        response.status(200).send({message: 'Login successful'});
    },

    updatePassword = async (data, response) => {
        if (!data.email || !data.password || !data.newPassword) {
            response.status(404).send({message: 'Parameter is missing'});
            return;
        }

        const userData = await database.checkDuplicate('User', 'email', data.email); // tableName, identifierName, identifierValue
        if(!userData) {   // true means data found and false means data not found
            response.status(404).send({message: 'Email is not register with us!'});
            return;
        }
        const checkPassword = await bcryptService.passwordCompare(userData[0].password, data.password);
        if(!checkPassword) {
            response.status(400).send({message: 'Old password is incorrect'});
            return;
        }
        data.password = await bcryptService.encryptPassword(data.newPassword);
        delete data.newPassword;
        const updateData = await database.updateTableData('User', data, 'email', data.email);
        if(updateData === null) {
            response.status(500).send(internalServerError);
        } else {
            response.status(200).send({message: 'password Update successfully'});
            // callback(null, updateStatus);
        }
    },

    forgotPassword = async (data, response) => {
        if (!data.email) {
            response.status(404).send({message: 'Parameter is missing'});
            return;
        }
        const userData = await database.checkDuplicate('User', 'email', data.email); // tableName, identifierName, identifierValue
        if(!userData) {   // true means data found and false means data not found
            response.status(404).send({message: 'Email is not register with us!'});
            return;
        }
        const mailOptions = {
            from : '',
            to: data.email,
            subject: 'Forgot Password Link',
            // text: 'Click here to reset your link',
            html: emailTemplates.forgotPassword(userData[0], 'google.com')
        };
        const sendResetPassword = await emailService.sendEmail(mailOptions);
        if (sendResetPassword) {
            response.status(200).send({message: `Reset link has been set to your email: ${mailOptions.to} link will expires in 10 minute`});
        } else {
            response.status(500).send(internalServerError);
        }
    },

    updateUserDetails = async (data, response) => {
        const userData = await database.checkDuplicate('User', 'email', data.email); // tableName, identifierName, identifierValue
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

    getUserDetails = async (request, response) => {
        const { userId } = await tokenService.decodeToken(request.cookies.S);
        const existence = await database.checkDuplicate('User', 'id', userId);
        if(!existence) {
            response.status(400).send({message: 'User does not exists'})
            return;
        }
        const users = await database.fetchDataFromTable('User', `id = '${userId}'`);
        if(users) {
            response.status(200).send({message: 'User Details fetched successfully', userDetails : users[0]});
        } else {
            response.status(500).send(internalServerError);
        }
    },

    sendEmailActivationLink = async (emailOptions, request, response) => {
        link = `useremailverificationsddsbbds${request.cookies.S}_hgvghvghcgfcgf`;
        const mailOptions = {
                from: '',
                to: emailOptions.email,
                subject: emailOptions.subject,
                html: `<a href = '${link}' style = 
                "border: none; padding: 10px; text-align: center; font-size: 15px; background: red; color: white;"> 
                Click </a> `,
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

    // For Admin Panel

    module.exports = {
        userLogin,
        userSignUp,
        getUsers, 
        updatePassword,
        forgotPassword,
        updateUserDetails,
        getUserDetails,
        sendEmailActivationLink,
    };
}());