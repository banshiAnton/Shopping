// import Flag from '../models/flag';

let Flag = require('../models/flag');
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shopping',{
    useMongoClient: true,
});

let flags = [
    new Flag({
        country: 'United Kingdom',
        imagePath: 'https://www.votpusk.ru/story/edit/foto/large/15831.jpg'
    }),
    new Flag({
        country: 'France',
        imagePath: 'http://kolizej.at.ua/_pu/2/s85366431.jpg'
    }),
    new Flag({
        country: 'Germany',
        imagePath: 'https://g.io.ua/img_aa/large/1438/29/14382989.jpg'
    }),
    new Flag({
        country: 'Italy',
        imagePath: 'http://tripperadvisor.ru/upload/information_system_116/2/1/7/item_21757/information_items_1226843018.jpg'
    }),
    new Flag({
        country: 'Spain',
        imagePath: 'http://dic.academic.ru/pictures/enc_colier/fg_spain.jpg'
    }),
    new Flag({
        country: 'Portugal',
        imagePath: 'http://www.td-travel.ru/images/flags/big/PT.jpg'
    }),
    new Flag({
        country: 'Japan',
        imagePath: 'https://www.votpusk.ru/story/edit/foto/large/16481.jpg'
    }),
    new Flag({
        country: 'China',
        imagePath: 'https://www.votpusk.ru/story/edit/foto/large/16485.jpg'
    }),
    new Flag({
        country: 'USA',
        imagePath: 'https://vignette4.wikia.nocookie.net/allmafia/images/e/e7/%D0%A4%D0%BB%D0%B0%D0%B3_%D0%A1%D0%A8%D0%90.jpg/revision/latest/scale-to-width-down/640?cb=20150826171428&path-prefix=ru'
    }),
    new Flag({
        country: 'Canada',
        imagePath: 'https://otvet.imgsmail.ru/download/87d3bf02435c2cbfaf85e6785f6a7cc0_i-546.jpg'
    }),
];

let count = 0;
for(let flag of flags) {
    flag.save(function (err, result) {
        if(err) {
            console.log("Err", err);
            throw new Error();
        } else{
            console.log("Res", result);
            count++;
            if(count === flags.length) {
                mongoose.disconnect();
            }
        }
    })
}