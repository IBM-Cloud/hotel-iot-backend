var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Reservation = require('./reservation');

var RoomSchema = mongoose.Schema({
    number: Number,
    beacon: String,
    macaddress: String,
    beds: Number,
    cost: Number,
    reservations: [Reservation]
})

module.exports = mongoose.model('Room', RoomSchema);