const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');

Router.use(bodyParser.json());
var Product_Type = require('../models/product_type');

Router.get('/admin.html/admin', function (req, res, next) {
    Product_Type.find(function (err, docs) {
        return res.send(docs);
    });
});

Router.post('/product_type_add', function (req, res) {
    Product_Type.findOne({ product_type_name: req.body.product_type_name }, function (err, docs) {
        if (!docs) {
            var product_type_data = {
                product_type_name: req.body.product_type_name,
                product_subtype_name: req.body.product_subtype_name,
                product_sub_subtype_name: req.body.product_sub_subtype_name,
                product_type_quantity: req.body.product_type_quantity
            }
            new Product_Type(product_type_data).save();
        }
        else {
            // docs.product_type_name = req.body.product_type_name;
            // docs.product_subtype_name = req.body.product_subtype_name;
            // docs.product_sub_subtype_name = req.body.product_sub_subtype_name,
            docs.product_type_quantity += parseInt(req.body.product_type_quantity);
            docs.save();
        }
    });
    //mongoose.connection.close();
    //res.redirect('/admin.html');
});

module.exports = Router;