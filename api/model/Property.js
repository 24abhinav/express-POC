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

    fetchPropertyDetails = async (request, response) => {
        // const query = `SELECT * FROM property INNER JOIN countries ON property.country = countries.id INNER JOIN pricingmodel on property.pricingModel = pricingmodel.id INNER JOIN states on property.state = states.id INNER JOIN cities on property.city = cities.id WHERE property.id = ${propertyId};`;
        const propertyId = request.cookies.propertyId;
        let propertyDetails = await databse.fetchDataFromTable('property', `id = ${propertyId}`);
        const pricingModel = await databse.fetchDataFromTable('pricingmodel', `propertyId = ${propertyDetails[0].pricingModel}`);
        const country = await databse.fetchDataFromTable('countries', `id = ${propertyDetails[0].country}`);
        const state = await databse.fetchDataFromTable('states', `id = ${propertyDetails[0].state}`);
        const city = await databse.fetchDataFromTable('cities', `id = ${propertyDetails[0].city}`);
        const images = await databse.fetchDataFromTable('propertyimages', `propertyId = ${propertyId}`);
        const tenantId = await databse.fetchDataFromTable('propertytenantassociation', `propertyId = ${propertyId}`);
        const tenantDetails = await databse.fetchDataFromTable('tenantdetails', `id = ${tenantId[0].tenantId}`);

        propertyDetails[0].pricingModel = pricingModel[0];
        propertyDetails[0].country = country[0];
        propertyDetails[0].state = state[0];
        propertyDetails[0].city = city[0];
        propertyDetails[0].images = images[0];
        propertyDetails[0].tenantDetails = tenantDetails[0];

        // console.log(propertyDetails);
        if(propertyDetails === null) {
            response.status(500).send(internalServerError);
        } else {
            response.status(200).json(propertyDetails);
        }
    },

    module.exports = {
        addProperty,
        updatePropertyDetails,
        fetchPropertyDetails,
    };

}());
