(function() {
    const database = require('../services/databse');
    const property = require('../model/Property');
    const internalServerError = { message: 'Internal server error'};

    addInvestor = async (requestPayload, response) => {
        const addInvestordata = await database.inserDataToTable('investors', requestPayload);
        if(addInvestordata) {
            response.status(200).send({message: 'Invester addedd successfully'});
        } else {
            response.status(500).send(internalServerError);
        }
    },

    fetchAllInvestors = async (response) => {
        const investerList = await database.fetchDataFromTable('User', `hasInvested = ${true}`);
        response.status(200).send(investerList);
    },

    fetchInveterDetailsByPropertyId = async (propertyId, response) => {
        const query =
        `SELECT * FROM investors
        INNER JOIN user ON investors.userId = user.id
        INNER JOIN property on investors.propertyId = property.id
        where propertyId = ${propertyId};`;

        const investors = await database.queryRunner(query);
        if(investors) {
            response.status(200).send(investors);
        } else {
            response.status(500),send(internalServerError);
        }
    },

    investmentDetailsByUserId = async (userId, response) => {
        const query =
        `SELECT * FROM investors
        INNER JOIN user ON investors.userId = user.id
        where userId = ${userId};`;
        const investors = await database.queryRunner(query);
        if(investors) {
            for (const [i, element] of investors.entries()) {
                investors[i].propertyId = await property.fetchPropertyDetails(element.propertyId);
            }
            response.status(200).send(investors)
        } else {
            response.status(500).send(internalServerError);
        }
    },
    
    module.exports = {
        addInvestor,
        fetchAllInvestors,
        fetchInveterDetailsByPropertyId,
        investmentDetailsByUserId,
    };

}());