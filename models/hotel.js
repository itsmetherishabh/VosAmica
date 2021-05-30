const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    description: String,
    name: String,
    locations: String
});

const Hotel = new mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;