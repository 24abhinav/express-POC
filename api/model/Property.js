(function() {

    const database = require('../services/database');
    const internalServerError = {message: 'Internal server Error'};

    addProperty = async (propertyData, response) => {
        let insertData = await database.insertDataToTable('property', propertyData);
        if (insertData) {
            response.status(200).send({message: 'property Added successfully'});
        } else {
            response.status(500).send(internalServerError);
        }
    },

    updatePropertyDetails = async (propertyDetails, response) => {
        let updatedDetails = await database.updateTableData('property', propertyDetails, 'id', propertyDetails.id);
        if (updatedDetails === null) {
            response.status(500).send(internalServerError);
        } else {
            response.status(200).send({message: 'property details updated successfully', updatedDetails})
        }
    },

    fetchPropertyDetails = async (propertyId) => {
        // const query = `SELECT * FROM property INNER JOIN countries ON property.country = countries.id INNER JOIN pricingmodel on property.pricingModel = pricingmodel.id INNER JOIN states on property.state = states.id INNER JOIN cities on property.city = cities.id WHERE property.id = ${propertyId};`;
        let propertyDetails = await database.fetchDataFromTable('property', `id = ${propertyId}`);
        const pricingModel = await database.fetchDataFromTable('pricingmodel', `propertyId = ${propertyDetails[0].pricingModel}`);
        const country = await database.fetchDataFromTable('countries', `id = ${propertyDetails[0].country}`);
        const state = await database.fetchDataFromTable('states', `id = ${propertyDetails[0].state}`);
        const city = await database.fetchDataFromTable('cities', `id = ${propertyDetails[0].city}`);
        const images = await database.fetchDataFromTable('propertyimages', `propertyId = ${propertyId}`);
        const tenantId = await database.fetchDataFromTable('propertytenantassociation', `propertyId = ${propertyId}`);
        const tenantDetails = await database.fetchDataFromTable('tenantdetails', `id = ${tenantId[0].tenantId}`);


        // YAHAN KA BHASAR SAAF KARNA HAI\

        propertyDetails[0].pricingModel = pricingModel[0];
        propertyDetails[0].country = country[0];
        propertyDetails[0].state = state[0];
        propertyDetails[0].city = city[0];
        propertyDetails[0].images = images[0];
        propertyDetails[0].tenantDetails = tenantDetails[0];
        return propertyDetails;
    },

    module.exports = {
        addProperty,
        updatePropertyDetails,
        fetchPropertyDetails,
    };

}());
