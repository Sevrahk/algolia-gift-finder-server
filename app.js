var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet');
const enforce = require('express-sslify');
const dotenv = require('dotenv');
const router = require('./router');
dotenv.config();

var app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'production') {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

router(app);

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Server error');
});

module.exports = app;
