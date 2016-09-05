var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var ReservationSchema = mongoose.Schema({
    date: Date,
    amount: Number,
    provider: String,
    payment: Number,
    outcome: String,
    bedtime: Date,
    waketime: Date,
    energy: Number,
    steps: Number,
    sleep: Number,
    code: Number
})

module.exports = mongoose.model('Reservation', ReservationSchema);