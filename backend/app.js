var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const connection = require('./Connection')
const passport = require('passport');
const session = require('express-session');
const { Strategy: OpenIDConnectStrategy } = require('passport-openidconnect');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(passport.initialize());
app.use(passport.session());

passport.use('openidconnect', new OpenIDConnectStrategy({
  issuer: 'OIDC_PROVIDER_ISSUER_URL',
  clientID: 'CLIENT_ID',
  clientSecret: 'CLIENT_SECRET',
  authorizationURL: 'OIDC_PROVIDER_AUTHORIZATION_URL',
  tokenURL: 'OIDC_PROVIDER_TOKEN_URL',
  userInfoURL: 'OIDC_PROVIDER_USERINFO_URL',
  callbackURL: 'REDIRECT_URI',
  scope: 'openid profile email',
}, (issuer, sub, profile, accessToken, refreshToken, done) => {
  // Perform any necessary actions upon successful authentication
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});


app.get('/login', passport.authenticate('openidconnect'));

// Callback route after authentication
app.get('/callback', passport.authenticate('openidconnect', {
  successRedirect: '/success',
  failureRedirect: '/failure',
}));

// Example success route
app.get('/success', (req, res) => {
  res.send('Successfully authenticated!');
});

// Example failure route
app.get('/failure', (req, res) => {
  res.send('Authentication failed!');
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
