const express = require('express');
const Router = express.Router();
var Product = require('../models/product');
var Product_Type = require('../models/product_type');

const fileUpload = require('express-fileupload');
Router.use(fileUpload());
const { ensureAuthenticated } = require('../config/auth');
//Get home page

Router.get('/index.html', function (req, res) {
    Product.find(function (err, docs) {
        // var productChuncks = [];
        // var chunkSize = 3;
        // for(var i = 0; i < docs.length; i += chunkSize){
        //     productChuncks.push(docs.slice(i, i + chunkSize)); //this means if we are at 0 index the it takes whole chunck of product and put it in array as an objecy...
        //     console.log(docs.length);
        // }
        Product_Type.find({}, null, { sort: {product_type_name:1, product_subtype_name:1, product_sub_subtype_name:1} }, function (err, doc) {
                res.render("index", { products: docs, product_type: doc, user: req.user });
        });
    });
});

//Get specific type of product
Router.get('/index.html/:param1', ensureAuthenticated, function (req, res, next) {
    Product_Type.find(function (err, doc) {//to find all product in this specific type
        Product.find({ _id: req.params.param1 }, function (err, docs) {
            res.render("product_details", { product: docs, product_type: doc, user: req.user });
            console.log(req.params);
            //res.json({ products: docs, product_type: doc });
        });
        //return res.send(200, docs);
        // docs.product_type_name = req.body.product_type_name;
        // docs.product_type_quantity += parseInt(req.body.product_type_quantity);
        // docs.save();
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

    //var file = req.files.product_img;

    // if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
    //     file.mv('views/images/upload_images/' + file.name, function (err) {
    //         if (err)
    //             return res.status(500).send(err);

    var product_data = {
        product_name: req.body.product_name,
        product_type: req.body.product_type,
        product_description: req.body.product_description,
        product_img: img_name,
        product_XS: req.body.product_xs,
        product_S: req.body.product_s,
        product_M: req.body.product_m,
        product_L: req.body.product_l,
        product_XL: req.body.product_xl,
        product_XXL: req.body.product_xxl,
        //product_for: req.body.product_for,
        product_price: req.body.product_price
    }
    new Product(product_data).save();
    res.redirect('./index.html');
    //     });
    // }
});


module.exports = Router;