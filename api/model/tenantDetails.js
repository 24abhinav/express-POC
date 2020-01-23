(function() {

    const database = require('../services/databse');
    const internalServerError = {message: 'Internal server Error'};

    addTenant = async (data, response) => {
        const tenantData = await database.inserDataToTable('tenantdetails', data);
        if(tenantData === null) {
            response.status(500).send(internalServerError);
        } else {
            response.status(200).send({message: 'Tenant Details Added successfully'});
        }
    },

    propertyTenantAssociation = async (data, response) => {
        const condition = `tenantId = ${data.tenantId} and propertyId = ${data.propertyId}`;
        const checkDuplicate = await database.fetchDataFromTable('propertytenantassociation', condition);
        if(checkDuplicate === null) {
            response.status(500).send(internalServerError);
        } else if(checkDuplicate.length > 0) {
            response.status(409).send({message: 'mapping has already been done!!'});
        } else {
            const isDataMapped = await database.inserDataToTable('propertytenantassociation', data);
            if(isDataMapped === null) {
                response.status(500).send(internalServerError);
            } else {
                response.status(200).send({message: 'Tenant Mapping Done'});
            } 
        }
    },

    module.exports = {
        addTenant,
        propertyTenantAssociation,
    };
}());