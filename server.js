/**
 * Module dependencies.
 */
require('nko')('Wg9lXT8VXspD5C-9');
var express = require('express');
var http = require('http');
var path = require('path');
var holla = require("holla");
var io = require("socket.io");
var isProduction = (process.env.NODE_ENV === 'production');
var port = (isProduction ? 80 : 8000)
var app = express();

// all environments
app.set('port', port);
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

var server = http.createServer(app).listen(app.get('port'), function (err) {
    console.log('Express server listening on port ' + app.get('port'));
     if (err) { console.error(err); process.exit(-1); }

  	// if run as root, downgrade to the owner of this file
	if (process.getuid && process.getuid() === 0) {
		require('fs').stat(__filename, function(err, stats) {
		if (err) { return console.error(err); }
		process.setuid(stats.uid);
		});
	}
});

var io = io.listen(server);

require("./config/config")(app, io, rtc);
require("./config/URLMappings").mappings();
require("./modules/socket")();
