const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    _id:String,
    dates:Array
});

const Availability = new mongoose.model("Availability", availabilitySchema);

module.exports = Availability;
