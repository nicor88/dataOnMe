var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var ejs = require('ejs');
var path = require('path');
var mongoose = require('mongoose');
var db = require('./configs/db');
var app = express();

app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'public'));
app.use('/', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'mean-stack',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

require('./configs/passport')(app, passport);
require('./route')(app, passport);

mongoose.connect(db.url, function(err) {
    if(err) {
        console.log('MongoDB connection error: ', err);
    } else {
        console.log('conntected to '+db.url+'....');
    }
});
var server = app.listen(app.get('port'), function(err) {
    if(err) throw err;
    var serverStatus = 'Server listening at port: ' + server.address().port;
    console.log(serverStatus);
});