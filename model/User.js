(function() {
    const tokenService = require('../services/token');
    const database = require('../services/databse');
    const bcryptService = require('../services/bcrypt');
    const emailService = require('../services/email');
    const internalServerError = { status: 500, message: 'internal server error'}


    userSignUp = async (data, callback) => {
        const checkDuplicate = await database.checkDuplicate('User', 'email', data.email); // tableName, idetifierName, identifierValue
        if(checkDuplicate) { // true means data found and false means data not found
            callback({
                status: 409,
                message: 'User already exist'
            });
            return;
        }

        const hashedPassword = await bcryptService.encryptPassword(data.password);
        if(hashedPassword === null) {
            callback(internalServerError);
            return;
        }
        delete data.password;
        data.password = hashedPassword
        const inserData = await database.inserDataToTable('User', data);
        if(inserData === null) {
            callback(internalServerError);
            return;
        } else {
            callback(null,{
                status: 200,
                message: 'SignUp successfull'
            });
        }
    }

    userLogin = async (data, callback) => {
        const userData = await database.fetchDataFromTable('User', `email = '${data.email}'`);
        if(userData.length === 0) {
            callback({
                status: 400,
                message: 'email is not registered'
            });
            return;
        }
        // console.log(userData);
        // console.log(data);
        const checkPassword = await bcryptService.passwordCompare(userData[0].password, data.password);
        if(checkPassword === false) {
            callback({
                status: 400,
                message: 'email/password incorrect'
            })
            return;
        }
        const token = await tokenService.createToken({
            name: {userData},
            mobile : {userData},
            email: {userData}
        });

        callback(null, {
            status: 200,
            message: 'Login successfull',
            token
        });
    },

    updatePassword = async (data, callback) => {
        const userData = await database.checkDuplicate('User', 'email', data.email); // tableName, idetifierName, identifierValue
        if(!userData) {   // true means data found and false means data not found
            callback({
                status: 404,
                message: 'Email is not register with us!'
            });
            return;
        }
        data.password = await bcryptService.encryptPassword(data.password);
        const updateStatus = await database.updateTableData('User', data, 'email', data.email);
        if(updateStatus === null) {
            callback(internalServerError);
        } else {
            callback(null, updateStatus);
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
                html: `<html><head></head><body style="font-family: Arial; font-size: 12px;"><div><table role="presentation" cellpadding="0" cellspacing="0" style="font-size: 0px;width: 80%;background:#7289DA;"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:57px;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:undefined;width:640px;"><![endif]--><div><div style="display: flex;"><img style="width: 27vh;height: 8vh;" src="https://i.ibb.co/gz7t0C3/prop-1.png"></div><p style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:36px;font-weight:600;line-height:36px;text-align:center;">Hi ' + emailOptions.name + '</p><p style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:19px;font-weight:600;line-height:30px;text-align:center;">Please verify your email by clicking  on the link below</p></div><button style="background-color: #dc0f0f;width: 23vh;border-radius: 7px;height: 6vh;margin-top: 3vh;"><a style="color: white;text-decoration: none;font-size: 2.5vh;" href=' + link + '>Verify Email</a></button><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div></body></html>`,
                template: 'resetPw',
                context: emailOptions,
                text : emailOptions.text,
                // cc : 'nayankr777@gmail.com'
        }
        // console.log('email object data----->', mailOptions);
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