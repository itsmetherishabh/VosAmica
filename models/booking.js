const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    _id:String,
    checkIn:Date,
    checkOut:Date,
    roomtype:String
});

const Booking = new mongoose.model("Booking", bookingSchema);

module.exports = Booking;
