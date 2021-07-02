const mongoose = require('mongoose');

const connectSchema = new mongoose.Schema({
    email:String,
    message:String
});

const Connect = new mongoose.model("Connect", connectSchema);

module.exports = Connect;
