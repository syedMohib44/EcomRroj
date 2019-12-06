const express = require('express');
const Router = express.Router();
var Product = require('../models/product');
var Product_Type = require('../models/product_type');

const fileUpload = require('express-fileupload');
Router.use(fileUpload());
const { ensureAuthenticated } = require('../config/auth');
//Get home page

Router.get('/seller/index', function (req, res) {
    Product.find(function (err, docs) {
        Product_Type.find({}, null, { sort: {product_type_name:1, product_subtype_name:1, product_sub_subtype_name:1} }, function (err, doc) {
                res.render("seller-index", { products: docs, product_type: doc, user: '' });
        });
    });
});

module.exports = Router;