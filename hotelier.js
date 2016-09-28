/* This is a little node app that makes hotels in the hotel database */

var mongoose = require('mongoose');
var configDB = require('./config/database.js');
var Reservation = require('./models/reservation');
var Room = require('./models/room');
var Floor = require('./models/floor');
var Hotel = require('./models/hotel');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url); // connect to our database

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var floornames = ['lobby', 'first', 'second', 'third', 'forth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];

function makeHotel(name, location, country, icon) {

    var hotel = new Hotel();
    hotel.name = name;
    hotel.location = location;
    hotel.country = country;
    hotel.icon = icon;

    for (var floorcount = 1; floorcount < 5; floorcount++) {

        var floor = new Floor();
        floorname = floornames[floorcount];
        floor.level = floorcount;

        for (var roomcount = 1; roomcount < 11; roomcount++) {
            var room = new Room();
            room.number = roomcount;
            room.beds = getRandomIntInclusive(1, 2);
            console.log('beds: ' + room.beds);
            floor.rooms.push(room);
        }

        hotel.floors.push(floor);
    }

    hotel.save(function (err) {
        if (err) {
            throw err;
        }
    })
}

makeHotel('Cielo Roja', 'Ottawa', 'Canada', 'ottawa.png');
makeHotel('Cielo Azul', 'Buenos Aires', 'Argentina', 'buenos.png');
makeHotel('Cielo Estrella', 'Austin', 'Texas', 'austin.png');
makeHotel('Cielo Gaudi', 'Barcelona', 'Spain', 'barcelona.png');
makeHotel('Cielo Vegas', 'Las Vegas', 'Nevada', 'lasvegas.png');
makeHotel('Cielo Adige', 'Verona', 'Italy', 'verona.png');