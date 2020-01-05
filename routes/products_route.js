const express = require('express');
const Router = express.Router();
var Product = require('../models/product');
const Cart = require('../models/cart');
const mongoose = require('mongoose');

const fileUpload = require('express-fileupload');
Router.use(fileUpload());
const { ensureAuthenticated } = require('../config/auth');
var GlobalCart = null;
//Get home page

Router.get('/index.html', function (req, res) {
    Product.find(function (err, docs) {
        res.render("index", { products: docs });
    });
});

//Get specific type of product
Router.get('/index.html/:param1', ensureAuthenticated, function (req, res, next) {
    Product.findOne({ _id: req.params.param1 }, function (err, docs) {
        res.render("product_details", { product: docs });
    });
}); 

Router.get('/my_cart', function (req, res, next) {
    Cart.findOne({ owner: req.user._id })
        .populate('items.item')
        .exec((err, docs) => {
            if (err) return next(err);

            res.render('shoping_cart.ejs', { cart: docs });
        });
});

// Router.get('/plus_qnty/:param1', ensureAuthenticated, function (req, res, next) {
//     res.redirect('/my_cart');
// });


// Router.get('/plus_qnty/:param1', function (req, res, next) {
//     Cart.find({ owner: req.user._id}, {'items': { $elemMatch : {_id : req.params.param1}}}, function (err, docs) {
//         GlobalCart = docs[0].items[0];
//         GlobalCart.quantity += 1;
//         GlobalCart.price *= GlobalCart.quantity;
//         console.log(GlobalCart);
//         res.redirect('/change');
//         //var v = docs.items.pull(String(req.params.param1));
//         //docs.quantity += 1;
//         //docs.total += docs.price;

//         // docs.save(function (err){
//         //     if (err) return next(err);
//         //     return res.redirect('/index.html');
//         // });
//         //docs.quantity = docs.quantity
//         //docs.total = (docs.total + parseFloat(req.body.price)).toFixed(2);
//     });
// });

Router.get('/plus_qnty/:param1', function (req, res, next) {
    Cart.findOne({ owner: req.user._id}).populate('items.item').exec(function (err, docs) {
        console.log(docs);
        for (var i = 0; i < docs.items.length; i++) {
            if(req.params.param1 == docs.items[i]._id){
                GlobalCart = docs.items[i];
                GlobalCart.quantity += 1;
                GlobalCart.price = GlobalCart.quantity * GlobalCart.item.product_price;
                console.log(GlobalCart);
                docs.items[i] = GlobalCart;
                docs.total += GlobalCart.item.product_price;
                break;
            }            
        }
        docs.save();
        res.redirect('/my_cart');
    });
});

// Router.get('/change', function(req, res, next) {
//     Cart.updateOne({ owner: req.user._id, 'items._id': GlobalCart._id}, {$set: {items: GlobalCart}}, function (err, docs) {
//         // /docs[0].items[0] = GlobalCart;
//         if(docs)
//             console.log('done' + GlobalCart + ' ' + docs);
//         res.redirect('/my_cart');
//     });
// });

Router.post('/index.html/:param1', function (req, res, next) {
    var changed = false;
    Cart.findOne({ owner: req.user._id }, (err, cart) => {
        for (var i = 0; i < cart.items.length; i++) {
            if (cart.items[i].item._id == req.body.product_id) {
                cart.items[i].quantity += 1;
                changed = true;
                break;
            }
        }
        if (changed == false) {            
            cart.items.push({
                item: req.body.product_id,
                quantity: parseInt(req.body.quantity),
                price: parseFloat(req.body.priceValue)
            });
        }
        console.log(changed + ' ' + req.body.product_id);
        cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);
        cart.save((err) => {
            if (err) return next(err);
            return res.redirect('/index.html');
        });
        // Cart.findOne({ owner: req.user._id }).populate('items.item').exec((err,cart) => {
        //     if (1) {
        //         cart.items.quantity += 1;
        //         console.log(cart.items.item);
        //     }
        //     else {
        //         cart.items.push({
        //             item: req.body.product_id,
        //             price: parseFloat(req.body.priceValue),
        //             quantity: parseInt(req.body.quantity)
        //         });
        //         }
        // cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);
        // cart.save((err) => {
        //     if (err) return next(err);
        //     return res.redirect('/index.html');
        // })
        //TODO: Do this after payment from cart...
        // const usp = new Users_Products();
        // usp.user_id = req.user._id;
        // usp.items = cart.items;
        // date = Date.now();
        // usp.save();
    });
});

Router.post('/product_add', function (req, res) {
    //var file = req.files.product_img2;
    var file = req.files.product_img;
    var img_name = [];//file.name;

    for (var i = 0; i < file.length; i++) {
        var img = file[i].name;
        console.log(img);
        if (file[i].mimetype == "image/jpeg" || file[i].mimetype == "image/png" || file[i].mimetype == "image/gif") {
            file[i].mv('views/images/upload_images/' + file[i].name)
            img_name.push(img);
        }
        else
            return res.status(500).send(err);
    }

    var colors = req.body.product_colors;
    var product_colors = [];
    for (var i = 0; i < colors.length; i++) {
        if (colors[i] != " " || colors[i] != '' || colors[i] != null || colors[i] != 'undefined') {
            product_colors.push(colors[i]);
        }
    }
    //var file = req.files.product_img;

    // if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
    //     file.mv('views/images/upload_images/' + file.name, function (err) {
    //         if (err)
    //             return res.status(500).send(err);

    var product_data = {
        product_name: req.body.product_name,
        product_type: req.body.product_type,
        product_sub_type: req.body.product_sub_type,
        product_description: req.body.product_description,
        product_img: img_name,
        product_material: req.body.product_material,
        product_XS: req.body.product_xs,
        product_S: req.body.product_s,
        product_M: req.body.product_m,
        product_L: req.body.product_l,
        product_XL: req.body.product_xl,
        product_XXL: req.body.product_xxl,
        product_colors: product_colors,
        //product_for:          req.body.product_for,
        product_price: req.body.product_price
    }
    new Product(product_data).save();
    res.redirect('./index.html');
    //     });
    // }
});


module.exports = Router;