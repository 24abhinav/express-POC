(function() {

    const database = require('../services/database');
    const serverError = {message: 'Internal server Error!'};

    addBookingDetails = async (BookingDetails, response) => {
        const insertData = await database.insertDataToTable('propertyenquiry', BookingDetails);
        if(insertData) {
            response.status(200).send({message: 'Booking details addedd successfully'});
        } else {
            response.status(500).send(serverError);
        }
    },

    fetchBookingDetails = async (request, response) => {
        const bookingList = await database.fetchDataFromTable('propertyenquiry', null);
        if (bookingList) {
            response.status(200).send({message: 'contact List fetched successfully', bookingList});
        } else {
            response.status(500).send(serverError);
        }
    },

    deleteBookingDetails = async (id, response) => {
        const deletedBooking = await database.deleteRecord('propertyenquiry', `id = ${id}`);
        if (!deletedBooking) {
            response.status(200).send({message: 'Booking deleted successfully'});
        } else {
            response.status(500).send(serverError);
        }
    },
    
    module.exports = {
        addBookingDetails,
        fetchBookingDetails,
        deleteBookingDetails,
    };
}());