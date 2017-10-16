// import Product from '../models/product';

let Product = require('../models/product');
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shopping',{
    useMongoClient: true,
});

let products = [
    new Product({
        imagePath: 'http://fit4brain.com/wp-content/uploads/2016/01/coffee.jpg',
        countryImgPath: 'https://ru.wikipedia.org/wiki/%D0%98%D1%82%D0%B0%D0%BB%D0%B8%D1%8F#/media/File:Flag_of_Italy.svg',
        title: 'Espresso',
        description: 'Espresso (/ɛˈsprɛsoʊ/, Italian: [esˈprɛsso]) is coffee brewed by forcing a small amount of nearly boiling water under pressure through finely ground coffee beans. Espresso is generally thicker than coffee brewed by other methods, has a higher concentration of suspended and dissolved solids, and has crema on top (a foam with a creamy consistency).[1] As a result of the pressurized brewing process, the flavors and chemicals in a typical cup of espresso are very concentrated. Espresso is also the base for other drinks such as a caffè latte, cappuccino, caffè macchiato, caffè mocha, flat white, or caffè Americano.',
        price: 1.25
    }),
    new Product({
        imagePath: 'http://fit4brain.com/wp-content/uploads/2016/01/coffee.jpg',
        countryImgPath: 'https://ru.wikipedia.org/wiki/%D0%98%D1%82%D0%B0%D0%BB%D0%B8%D1%8F#/media/File:Flag_of_Italy.svg',
        title: 'Espresso',
        description: 'Espresso (/ɛˈsprɛsoʊ/, Italian: [esˈprɛsso]) is coffee brewed by forcing a small amount of nearly boiling water under pressure through finely ground coffee beans. Espresso is generally thicker than coffee brewed by other methods, has a higher concentration of suspended and dissolved solids, and has crema on top (a foam with a creamy consistency).[1] As a result of the pressurized brewing process, the flavors and chemicals in a typical cup of espresso are very concentrated. Espresso is also the base for other drinks such as a caffè latte, cappuccino, caffè macchiato, caffè mocha, flat white, or caffè Americano.',
        price: 1.25
    })
];

let count = 0;
for(let prod of products) {
    prod.save(function (err, result) {
        if(err) {
            console.log("Err", err);
            throw new Error();
        } else{
            console.log("Res", result);
            count++;
            if(count === products.length) {
                mongoose.disconnect();
            }
        }
    })
}