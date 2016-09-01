// Init
var express        = require('express');
var path           = require('path');
var favicon        = require('serve-favicon');
var log4js         = require('log4js');
var logger         = log4js.getLogger();
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var expressSession = require('express-session');
var port           = process.env.PORT || 5000;

// Setup API routes
var home           = require('./www/routes/home');
var company        = require('./www/routes/company');
var terms          = require('./www/routes/terms');
var privacy        = require('./www/routes/privacy');
var apple          = require('./www/routes/apple');
var link           = require('./www/routes/link');
var success        = require('./www/routes/success');

//Compression
var h5bp           = require('h5bp');
var compress       = require('compression');    

var app = express();

app.use(h5bp({ root: __dirname + '/src' }));
app.use(compress());

// view engine setup
app.set('views', path.join(__dirname, 'www/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'www')));
app.use(express.static(path.join(__dirname, 'src')));

app.use(express.static('src'));
app.use('/bower_components',  express.static(path.join(__dirname, 'bower_components')));

app.use('/home', home);
app.use('/company', company);
app.use('/terms', terms);
app.use('/privacy', privacy);
app.use('/link', link);
app.use('/success', success);
app.use('/apple-app-site-association', apple);

app.all('/*', function(req, res, next) {
    // Send the index.html for other files to support HTML5Mode
    res.sendFile('src/index.html', { root: __dirname });
    // req.session.timestamp = Date.now();    
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers, development error handler, will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler, no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var http   = require('http');
var server = http.createServer(app).listen(port);

logger.info("Running app on port " + port)

server.on("close", function() {
    process.exit();
});

module.exports = app;


