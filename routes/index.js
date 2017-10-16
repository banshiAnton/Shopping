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
let Cart = require('../models/cart');

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

    passport.authenticate('local.signin', (err, user , info) => {

        // console.log('args ', arguments);

        if(err) {
            next(err)
        } else if(info){
            console.log('Info ',info);
            res.send(info.message);
        } else {
            req.login(user, (err) => {
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

    passport.authenticate('local.signup', (err, user , info) => {

        // console.log('args ', arguments);

        if(err) {
            next(err)
        } else if(info){
            console.log('Info ',info);
            res.send(info.message);
        } else {
            req.login(user, (err) => {
                if (err) { return next(err); }
                req.session.user = req.user;
                return res.send('/profile');
            });
        }
    })(req, res, next);

});

router.get('/add-to-cart/:id', isLoggedIn,(req, res, next) => {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, (err, product) => {
        if(err) {
            console.log('Err', err);
            throw new Error(err);
            return res.redirect('/');
        }

        cart.add(product, product.id);
        req.session.cart = cart;
        console.log('Ses Cart', req.session.cart);
        res.redirect('/');
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        console.log('Log in true');
        return next();
    } else {
        console.log('Redirect to /');
        res.redirect('/signUp');
    }
};

function noLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
};

module.exports = router;