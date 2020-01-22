(function() {
    const DB = require('../services/databse');


    addProperty = (propertyData, callback) => {
        return new Promise(async (res, rej) => {
            let insertData = await DB.inserDataToTable('property', propertyData);
            console.log(insertData);
        });
    }

    module.exports = {
        addProperty
    }
}());