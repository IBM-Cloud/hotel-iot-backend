// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var request = require('request');
var watson = require('watson-developer-cloud');

var Reservation = require('../models/reservation');
var Timestamp = require('../models/timestamp');

// define the schema for our user model
var accountSchema = mongoose.Schema({

    local: {
        email: String,
        password: String,
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    stays: [Reservation.schema],
    access: [Timestamp.schema]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Account', accountSchema);