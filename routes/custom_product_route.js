const express = require('express');
const Router = express.Router();
var Product = require('../models/product');
var Product_Type = require('../models/product_type');
const { ensureAuthenticated } = require('../config/auth');

Router.get('/custom.html', ensureAuthenticated, function (req, res) {
    Product.find(function (err, docs) {
        Product_Type.find({}, null, { sort: {product_type_name:1, product_subtype_name:1, product_sub_subtype_name:1} }, function (err, doc) {
                res.render("custom_product", { products: docs, product_type: doc, user: req.user });
        });
    });
});

Router.post('/send_request', function(req, res){
    var file = req.files.desgine_img;
    var custom_mesasure = {
        cust_id: req.user.user_id,
        upper_arm: req.body.upper_arm,
        sleeve_length: req.body.sleeve_length,
        sleeve_radius: req.body.sleeve_radius,
        chest: req.body.chest,
        waist: req.body.waist,
        thigh: req.body.thigh,
        leg: req.body.leg,
        hips: req.body.hips,
    }
    new Custom_Measurement(custom_mesasure).save();
    res.redirect('/index');
});

module.exports = Router;