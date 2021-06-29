const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    image: String,
    name: String,
    description: String,
    locations: String,
    sdeluxe: Number,
    deluxe: Number,
    executive: Number
});

const Hotel = new mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;