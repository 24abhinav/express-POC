(function() {
    const tokenService = require('../services/token');
    const database = require('../services/databse');
    const bcryptService = require('../services/bcrypt');
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
        console.log(userData);
        console.log(data);
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


    module.exports = {
        userLogin,
        userSignUp,
        getUsers, 
        updatePassword,
        updateUserDetails,
        getUserDetailsByEmail
    }
}())