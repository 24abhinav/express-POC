(function() {
    const databse = require('../services/databse');
    const internalServerError = {message: 'Internal server Error'};

    addProperty = async (propertyData, response) => {
        let insertData = await databse.inserDataToTable('property', propertyData);
        if (insertData === null) {
            response.status(500).send(internalServerError);
        } else {
            response.status(200).send({message: 'property Added successfully'});
        }
    },
    updatePropertyDetails = async (propertyDetails, response) => {
        let updatedDetails = await databse.updateTableData('property', propertyDetails, 'id', propertyDetails.id);
        if (updatedDetails === null) {
            response.status(500).send(internalServerError);
        } else {
            response.status(200).send({message: 'pproperty details updated successfully', updatedDetails})
        }
    },

    module.exports = {
        addProperty,
        updatePropertyDetails
    }
}());