const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    image:String,
    description: String,
    name: String,
    locations: String,
    sdeluxe: Number,
    deluxe: Number,
    executive: Number
});

const Hotel = new mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;