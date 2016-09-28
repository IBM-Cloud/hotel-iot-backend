var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var ReservationSchema = mongoose.Schema({
    start: Date,
    end: Date,
    guest: String,
    hotel: String,
    amount: Number,
    bedtime: Date,
    waketime: Date,
    energy: Number,
    steps: Number,
    sleep: Number,
    code: Number
})

module.exports = mongoose.model('Reservation', ReservationSchema);