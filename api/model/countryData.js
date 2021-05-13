(function() {
    const database = require('../services/database');
    const serverError = {message: 'Internal server Error!'};

    fetchCountryList = async (request, response) => {
        const countryList = await database.fetchDataFromTable('countries', null);
        if(countryList) {
            response.status(200).send({message: 'Country list fetched successfully', countryList});
        } else {
            response.status(500).send(serverError);
        }
    },

    fetchStateList = async (countryId, response) => {
        const stateList = await database.fetchDataFromTable('states', `country_id = ${countryId}`);
        if (stateList) {
            response.status(200).send({message: 'State List fetched successfully', stateList});
        } else {
            response.status(500).send(serverError);
        }
    },
    fetchCityList = async (stateId, response) => {
        const cityList = await database.fetchDataFromTable('cities', `state_id = ${stateId}`);
        if (cityList) {
            response.status(200).send({message: 'City List fetched successfully', cityList});
        } else {
            response.status(500).send(serverError);
        }
    },

    module.exports = {
        fetchCountryList,
        fetchStateList,
        fetchCityList,
    };
}());
