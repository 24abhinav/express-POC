(function() {

    const database = require('../services/database');
    const serverError = {message: 'Internal server Error!'};

    addContactDetails = async (contactDetails, response) => {
        const insertData = await database.insertDataToTable('contact', contactDetails);
        if(insertData) {
            response.status(200).send({message: 'contact details addedd successfully'});
        } else {
            response.status(500).send(serverError);
        }
    },

    fetchContactDetails = async (request, response) => {
        const contactList = await database.fetchDataFromTable('contact', null);
        if (contactList) {
            response.status(200).send({message: 'contact List fetched successfully', contactList});
        } else {
            response.status(500).send(serverError);
        }
    },

    deleteContactDetails = async (id, response) => {
        const deletedContact = await database.deleteRecord('contact', `id = ${id}`);
        if (!deletedContact) {
            response.status(200).send({message: 'contact List fetched successfully'});
        } else {
            response.status(500).send(serverError);
        }
    },
    
    module.exports = {
        addContactDetails,
        fetchContactDetails,
        deleteContactDetails,
    };
}());