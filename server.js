/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var holla = require("holla");
var io = require("socket.io");

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

var rtc = holla.createServer(server);
var io = io.listen(server);

require("./config/config")(app, io, rtc);
require("./config/URLMappings").mappings();
require("./modules/socket")();
