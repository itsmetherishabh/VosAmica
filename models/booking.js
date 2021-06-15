const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    _id:String,
    checkIn:Date,
    checkOut:Date
});

const Booking = new mongoose.model("Booking", bookingSchema);

module.exports = Booking;
