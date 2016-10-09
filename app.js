/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

var mongoose = require('mongoose');
var fs = require('fs');
var dotenv = require('dotenv');

var Account = require('./models/account');
var Hotel = require('./models/hotel');
var Reservation = require('./models/reservation');
var Client = require('ibmiotf').IotfApplication;

var moment = require('moment');
require('moment-range');
var Hotel = require('./models/hotel');

// configuration ===============================================================
fs.createReadStream('config/.sample-env')
    .pipe(fs.createWriteStream('config/.env'));

/*
  IMPORTANT: DotEnv is only for dev environments. Please be sure to set any
  environment variables traditionally in the production environment.
 */

dotenv.load();

var temp;
var light;

mongoose.connect(process.env.DATABASE_CREDENTIALS);
var appClient = new Client({
    "org": "zrbfmw",
    "id": Date.now().toString(),
    "auth-method": "apikey",
    "auth-key": "a-zrbfmw-hxp8jukeqv",
    "auth-token": "bsV(PDUuU80IEIYFYO"
});

appClient.connect();

appClient.on("connect", function () {
    console.log("subscribe to input events");
    appClient.subscribeToDeviceEvents("NUC-CIELO");
});

appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
    //    if (eventType === 'motionSensor') {
    //        motionSensorData.motionPayload = JSON.parse(payload);
    //    } else {
    //        console.log('Got other events of ' + eventType + ' from ' + deviceId + ':' + JSON.stringify(payload));
    //    }

    appClient.publishDeviceCommand("NUCCIELO", "NUCCIELO", "blink", "json", {});

    var myData = {
        'DelaySeconds': 10
    };

    myData = JSON.stringify(myData);
    appClient.publishDeviceCommand("NUC-CIELO", deviceId, "blink", "json", 1);

    var datareceived = JSON.parse(payload)

    if (datareceived.d.temp != undefined) {
        temp = datareceived.d.temp;
    }

    if (datareceived.d.light != undefined) {
        light = datareceived.d.light;
    }


    //
    //    if (payload.d.hasOwnProperty('temp')) {
    //        temp = payload.d.temp;
    //    }


    if (payload) {
        console.log(datareceived.d)
    };

});



// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var bodyParser = require('body-parser');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// require files from routes, controllers, etc...
// require('./routes')(app);
// var routes = require('./routes');
// app.use('/', routes);

//var api = require('./api');
//app.use('/api', api);
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/login', function (req, res) {

    var details = req.body;

    var username = details.username;

    console.log(username);

    Account.findOne({
        'twitter.id': username
    }, function (err, user) {

        console.log('looking for account');

        if (err) {
            console.log(err);
        }

        if (user) {

            console.log('finding user');
            account = user;

        } else {

            console.log('creating user');

            account = new Account();
            account.twitter.id = username;

            account.save(function (err) {
                if (err) {
                    throw err;
                }
            })
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            account: account
        }, null, 3));
    })

})

app.get('/temp', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        temp: temp
    }, null, 3));
})

app.get('/light', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        light: light
    }, null, 3));
})

app.get('/environment', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        light: light,
        temp: temp
    }, null, 3));
})

app.post('/lighting', function (req, res) {



});


app.get('/reservations', function (req, res) {

    var reservations = new Array();

    var response;

    Hotel.find({}, function (err, hotels) {

        hotels.forEach(function (hotel) {

            hotel.floors.forEach(function (floor) {

                floor.rooms.forEach(function (room) {

                    room.reservations.forEach(function (reservation) {

                        console.log('guest: ' + reservation.guest);

                        if (reservation.guest === req.query.account) {

                            reservations.push(reservation);
                        }
                    });
                })
            })
        })

        response = {
            "reservations": reservations
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response, null, 3));
    })
})


app.post('/reservations', function (req, res) {

    var details = req.body;
    var username = details.account;
    var hotel = details.hotel;
    var checkin = details.checkin;
    var checkout = details.checkout;

    Hotel.findOne({
        'name': hotel
    }, function (err, record) {

        var availablerooms = new Array();

        var floorlevel = 0;

        console.log('searching for free rooms');

        record.floors.forEach(function (floor) {

            floor.rooms.forEach(function (room) {

                var freeroom = true;

                var available = {
                    floor: floorlevel,
                    room: room.number
                }

                if (room.reservations.length === 0) {

                    availablerooms.push(available);

                } else {

                    room.reservations.forEach(function (reservation) {

                        range = moment().range(reservation.start, reservation.end);

                        if (range.contains(checkin) || range.contains(checkout)) {

                            /* this room is not free */

                        } else {

                            /* this room is free */

                            availablerooms.push(available);
                        }
                    })
                }
            })

            floorlevel++;
        })

        if (availablerooms.length > 0) {

            console.log('reserving a room');

            /* Want to eventually pick a room with a choice of beds */

            var target = record.floors[availablerooms[0].floor].rooms[availablerooms[0].room - 1];

            var booking = new Reservation();

            booking.start = new Date(checkin);
            booking.end = new Date(checkout);
            booking.hotel = hotel;
            booking.guest = username;

            target.reservations.push(booking);

            record.save(function (err) {
                if (err) {
                    throw err;
                }
            });
        }
    })
})


app.get('/account', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        outcome: 'failure'
    }, null, 3));
})

app.get('/hotels', function (req, res) {

    var response = {
        outcome: 'failure'
    };

    Hotel.find({}, function (err, hotels) {

        if (err) {

        } else {

            var identifiers = new Array();

            //            console.log(JSON.stringify(hotels));


            for (var h = 0; h < hotels.length; h++) {
                console.log(JSON.stringify(hotels[h]));

                var simple = {
                    name: hotels[h].name,
                    location: hotels[h].location
                }
                identifiers.push(simple)
            }

            response.hotels = identifiers;
            response.outcome = 'success';
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response, null, 3));
    })
})

app.post('/newaccount', function (req, res) {
    var account = new Account();
    var claim = req.body;
})

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function () {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});