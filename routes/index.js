// import Product from '../models/product';
// import Flag from '../models/flag';

let express = require('express');
let router = express.Router();
let Product = require('../models/product');
let Flag = require('../models/flag');
let mongoose = require('mongoose');
let countryImagePath = '/images/flags/';
let csrf = require('csurf');
let passport = require('passport');

let csrfProtection = csrf();

mongoose.connect('mongodb://localhost/shopping',{
    useMongoClient: true,
});

// router.use(function timeLog (req, res, next) {
//     console.log('Time: ', Date.now())
//     next()
// });

router.use(csrfProtection);

router.use((req, res, next) => {
    res.locals.token = req.csrfToken();
    next();
});

router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('profile');
    console.log('Ses', req.session);
});

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.get('/', (req, res, next) => {
  Product.find((err, docs) => {
      let products = [];
      let stepChunk = 3;
      for(let i = 0; i < docs.length; i += stepChunk) {
          products.push(docs.slice(i, i + stepChunk));
      }

      res.render('index', { products , countryImagePath , title: 'Express'});
    });
});

router.get('/putCoffee', (req, res, next) => {
    res.render('putCoffee');
});

router.post('/putCoffee', (req, res, next) => {

    let {title, country, price, description} = req.body;

    console.log(title, country, price, description);

    let img = req.files.img.data.toString('base64');

    let newProduct = new Product({img, country, title, description, price});

    newProduct.save((err, prod) => {
        if(err) {
            console.log('Save err', err);
            throw new Error();
        } else {
            console.log("New Product", prod);
            res.send("post method done");
        }
    });

});

router.post('/signIn', (req, res, next) => {

    passport.authenticate('local.signin', function (err, user , info) {

        console.log('args ', arguments);

        if(err) {
            next(err)
        } else if(info){
            console.log('Info ',info);
            res.send(info.message);
        } else {
            req.login(user, function(err) {
                req.session.user = req.user;
                if (err) { return next(err); }
                return res.send('/profile');
            });
        }

    })(req, res, next);

});

router.get('/signUp', (req, res, next) => {
    res.render('signUp')
});

router.post('/signUp', (req, res, next) => {

    passport.authenticate('local.signup', function (err, user , info) {

        console.log('args ', arguments);

        if(err) {
            next(err)
        } else if(info){
            console.log('Info ',info);
            res.send(info.message);
        } else {
            req.login(user, function(err) {
                if (err) { return next(err); }
                req.session.user = req.user;
                return res.send('/profile');
            });
        }
    })(req, res, next);

});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        console.log('Log in true');
        return next();
    } else {
        console.log('Redirect to /');
        res.redirect('/');
    }
};

function noLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
};

// app.post('/login', function(req, res, next) {
//     passport.authenticate('local', function(err, user, info) {
//         if (err) {
//             return next(err); // will generate a 500 error
//         }
//         // Generate a JSON response reflecting authentication status
//         if (! user) {
//             return res.send({ success : false, message : 'authentication failed' });
//         }
//         // ***********************************************************************
//         // "Note that when using a custom callback, it becomes the application's
//         // responsibility to establish a session (by calling req.login()) and send
//         // a response."
//         // Source: http://passportjs.org/docs
//         // ***********************************************************************
//         req.login(user, loginErr => {
//             if (loginErr) {
//                 return next(loginErr);
//             }
//             return res.send({ success : true, message : 'authentication succeeded' });
//         });
//     })(req, res, next);
// });

// export default router;
module.exports = router;