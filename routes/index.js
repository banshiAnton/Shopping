let express = require('express');
let mongoose = require('mongoose');
let passport = require('passport');
let stripe = require('stripe')('sk_test_kX9iSyDFueVcvIf5Ora4rGvw');
let fs = require('fs');

let Product = require('../models/product');
let Cart = require('../models/cart');

let router = express.Router();

let countryImagePath = '/images/flags/';
let productImagePath = '/images/products/';
let productImagePathToSave = __dirname + '\\..\\public\\images\\products\\';

mongoose.connect('mongodb://localhost/shopping',{
    useMongoClient: true,
});

// MyColl.remove({}, function(err, row) {
//     if (err) {
//         console.log("Collection couldn't be removed" + err);
//         return;
//     }
//
//     console.log("collection removed");
// })

router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('profile');
});

router.get('/logout', isLoggedIn, (req, res, next) => {
    console.log('\nBefore Logout session', req.session);
    console.log('\nBefore Logout req.user', req.user);
    req.logout();
    res.redirect('/');
    console.log('\nLogout session', req.session);
    console.log('\nLogout req.user', req.user);
});

router.get('/', (req, res, next) => {

  let successMsg = req.flash('success')[0];

  Product.find((err, docs) => {
      let products = [];
      let stepChunk = 3;
      for(let i = 0; i < docs.length; i += stepChunk) {
          products.push(docs.slice(i, i + stepChunk));
      }

      res.render('index', { products, productImagePath, countryImagePath, successMsg, noMsg: !successMsg,title: 'Express'});
    });
});

router.get('/putCoffee', (req, res, next) => {
    res.render('putCoffee');
});

router.post('/putCoffee', (req, res, next) => {

    let {title, country, price, description} = req.body;

    console.log(title, country, price, description);

    let {name, data} = req.files.img;

    fs.writeFile(productImagePathToSave + name, data, (err) => {
        if (err) {
            console.log(err);
            throw err;
        } else {

            let newProduct = new Product({img:name, country, title, description, price});

            newProduct.save((err, prod) => {
                if(err) {
                    console.log('Save err', err);
                    throw new Error();
                } else {
                    console.log("New Product", prod);
                    res.send("post method done");
                }
            });
        }
    });

    //let img = req.files.img.data.toString('base64');

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
                if (err) { return next(err); }
                console.log('\nLogin Session', req.session);
                console.log('\nLogin User', req.user);
                return res.send('/profile');
            });
        }

    })(req, res, next);

});

router.get('/signUp',noLoggedIn , (req, res, next) => {
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
                // req.user = user;
                console.log('\nSignup Session', req.session);
                console.log('\nSignup User', req.user);
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
        req.session.cart = cart.getObj();
        console.log('\nSession cart', req.session.cart);
        res.redirect('/');
    });
});

router.get('/sopping-cart', isLoggedIn, (req, res, next) => {
    if(!req.session.cart) {
        return res.render('sopping-cart', {products: null});
    }

    let cart = new Cart(req.session.cart);
    res.render('sopping-cart', {products: cart.genArray(), totalPrice: cart.totalPrice});

});

router.get('/checkout', isLoggedIn, (req, res, next) => {
    if(!req.session.cart) {
        return res.redirect('/sopping-cart');
    }
    let cart = new Cart(req.session.cart);
    let errMsg = req.flash('error')[0];
    res.render('checkout', {total: cart.totalPrice, errMsg, noError: !errMsg});
});

router.post('/checkout', (req, res, next) => {
    if(!req.session.cart) {
        return res.redirect('/sopping-cart');
    }

    let cart = new Cart(req.session.cart);

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Charge for " + req.user.email
    }, {
        idempotency_key: "CXrbwPOKmbIdyKUZ"
    }, function(err, charge) {

        if(err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }

        req.flash('success', 'Success bought ' + cart.totalPrice);
        req.session.cart = null;
        res.redirect('/');

    });

});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
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