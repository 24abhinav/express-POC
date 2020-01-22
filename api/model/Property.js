(function() {
    const databse = require('../services/databse');
    const internalServerError = {message: 'Internal server Error'};

    addProperty = (propertyData, response) => {
        return new Promise(async (res, rej) => {
            let insertData = await databse.inserDataToTable('property', propertyData);
            if (insertData === null) {
                response.status(500).send(internalServerError);
            } else {
                response.status(200).send({message: 'property Added successfully'});
            }
        });
    }

    module.exports = {
        addProperty
    }
}());