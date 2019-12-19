const express = require('express');
const Router = express.Router();
var Product = require('../models/product');
var Product_Type = require('../models/product_type');

const fileUpload = require('express-fileupload');
Router.use(fileUpload());
const { ensureAuthenticated } = require('../config/auth');
//Get home page

Router.post('/seller/panel', function (req, res) {
    res.render("seller-panel-options");
});

Router.get('/seller/panel/clothes', function (req, res) {
    res.render("seller-panel-cloth");
});

Router.get('/seller/panel/others', function (req, res) {
    res.render("seller-panel-others");
});

module.exports = Router;