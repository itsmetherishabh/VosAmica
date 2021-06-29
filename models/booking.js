const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    roomId:String,
    checkIn:Date,
    checkOut:Date,
    roomtype:String,
    guestId:String,
    guestName:String
});

const Booking = new mongoose.model("Booking", bookingSchema);

module.exports = Booking;
