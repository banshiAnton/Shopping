let express = require('express');
let fileUpload = require('express-fileupload');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let mongoose = require('mongoose');
let passport = require('passport');
let flash = require('connect-flash');
let validator = require('express-validator');
let expressHbs = require('express-handlebars');
let MongoStore = require('connect-mongo')(session);
let csrf = require('csurf');
let index = require('./routes/index');


let app = express();

mongoose.connect('mongodb://localhost/shopping',{
    useMongoClient: true,
});

require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(fileUpload());
app.use(cookieParser());
app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    cookie: {
        maxAge: 180 * 60 * 1000
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(csrf());

app.use((req, res, next) => {
   console.log('\nSetup session', req.session);
   console.log('\nSetup req.user', req.user);
   res.locals.token = req.csrfToken();
   res.locals.login = req.isAuthenticated();
   res.locals.session = req.session;
   res.locals.user = req.user;
   next();

    // let collection = mongoose.connection.db.collection('sessions');
    //
    // collection.find().toArray(function(err, sessions) {
    //     console.log("\n\n\n\nPIMPODSGF\n\n\n\n");
    //     console.dir(sessions);
    // });


});

app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;