var Product = require('../models/products');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopdb', { useNewUrlParser: true,  useUnifiedTopology: true});

var product = [
    new Product({
    product_name: "polos",
    product_type: 'cloth',
    product_img: 'tshirt.jpg',
    product_price: 500
}),
new Product({
    product_name: "Polo",
    product_type: 'cloth',
    product_img: 'tshirt.jpg',
    product_price: 200
})
];

var done = 0;
for(var i = 0; i < product.length; i++){
    product[i].save(function (err, result) {
        done++;
        if(done == product.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}