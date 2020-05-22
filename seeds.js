var mongoose = require('mongoose'),
    Bars = require('./models/bars'),
    Comments = require('./models/comments');

var data = [
    {
        name:"Charmaine's",       image:"https://www.usnews.com/dims4/USNEWS/d7f2f09/2147483647/resize/1200x%3E/quality/85/?url=https%3A%2F%2Fmedia.beam.usnews.com%2Ff3%2F80%2F1e98b42641efaf40febd3c471663%2F3-charmaines-charmaines-embargo-sf-proper-manolo.jpg",
        desc:"bla bla"
    },
    {
        name:"Sky Bar",
        image:"https://a.cdn-hotels.com/gdcs/production30/d727/ed767998-0fbb-451d-afc0-12c39833e218.jpg",
        desc:"bla"
    },
    {
        name:"Octave",
        image:"https://a.cdn-hotels.com/gdcs/production76/d517/9385372b-77d1-44d8-a11a-b03703dd9e03.jpg",
        desc:"blo"
    },
    {
        name:"Terrat",
        image:"https://photos.mandarinoriental.com/is/image/MandarinOriental/barcelona-2014-fine-dining-terrat-01-dusk?wid=1080&hei=720&fmt=jpeg&qlt=75,0&op_sharpen=0&resMode=sharp2&op_usm=0.8,0.8,5,0&iccEmbed=0&printRes=72&fit=crop",
        desc:"ble"
    },
    {
        name:"CE LA VI",
        image:"https://m.buro247.sg/images/lifestyle/CLV_ca.jpg",
        desc:"bli"
    },
]

function seedDB() {
    Bars.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("all bars removed");
            data.forEach(function(seed) {
                Bars.create(seed, function(err, bar) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("add a new bar");
                        // Comments.create(
                        // {
                        //     text: "nice xừ",
                        //     author: "ronaldo"
                        // }, function(err, comment) {
                        //     if (err) {
                        //         console.log(err);
                        //     } else {
                        //         bar.comments.push(comment);
                        //         bar.save();
                        //         console.log("add new comment");
                        //     }
                        // })
                    }
                } )
            })
        }
    })   
}

module.exports = seedDB;