let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    password: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {

    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});

    let errors = req.validationErrors();

    if(errors) {
        let message = [];
        for(let i = 0; i < errors.length; i++) {
            console.log('errors', errors[i].msg);
            console.log('errors.length', errors.length);
            message.push(errors[i].msg);
        };
        return done(null, false, {message});
    };


    User.findOne({email}, function (err, user) {
        if(err) {
            return done(err);
        } else if (user) {
            return done(null, false, {message: 'Email is already used'});
        } else {
            let newUser = new User();
            newUser.email = email;
            newUser.password = newUser.encryptPassword(password);
            newUser.save(function (err, result) {
                if(err) {
                    console.log('Save user err', err);
                    throw new Error();
                } else {
                    console.log('New user', result);
                    done(null, result);
                }
            });
        };
    });
}));


passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    password: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {

    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        let message = [];
        for(let i = 0; i < errors.length; i++) {
            console.log('errors', errors[i].msg);
            console.log('errors.length', errors.length);
            message.push(errors[i].msg);
        };
        return done(null, false, {message});
    };


    User.findOne({email}, function (err, user) {
        if(err) {
            return done(err);
        }

        if(!user) {
            return done(null, false, {message: 'No user found'});
        }

        if(!user.validPassword(password)) {
            return done(null, false, {message: 'Wrong password'});
        }

        return done(null, user);
    });
}));