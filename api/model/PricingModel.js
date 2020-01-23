(function() {
    const database = require('../services/databse');

    const internalServerError = { message: 'Internal server error'}

    addPricingModel = async (data, response) => {
        const isDataInserted = await database.inserDataToTable('pricingmodel', data);
        if(isDataInserted === null) {
            response.status(500).send(internalServerError);
        } else {
            response.status(200).send({message: 'Pricing Model added successfully'});
        }
    },
    updatePringModelData = async (data, response) => {
        const isDataUpdated = await database.updateTableData('pricingmodel', data, 'propertyId', data.propertyId);
        if(isDataUpdated === null) {
            response.status(500).send(internalServerError);
        } else {
            response.status(200).send({message: 'Pricing Model updated successfully'});
        }
    },

    module.exports = {
        addPricingModel,
        updatePringModelData
    }
}());