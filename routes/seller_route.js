const express = require('express');
const Router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Product_Type = require('../models/product_type');

const Seller = require('../models/seller');
const { forwardAuthenticated } = require('../config/auth');

Router.get('/seller', forwardAuthenticated, function (req, res) {
    res.render("seller");
});

Router.get('/seller/login', forwardAuthenticated, function (req, res) {
    res.render('seller-login');
});

Router.get('/seller/register', function (req, res) {
    res.render('seller-register');
});

Router.post('/seller/register', function (req, res) {
    const seller_name = req.body.seller_name;
    const seller_email = req.body.seller_email;
    const seller_pass1 = req.body.seller_pass1;
    const seller_pass2 = req.body.seller_pass2;
    const seller_dob = req.body.seller_dob;
    const seller_cnic = req.body.seller_cnic;
    const seller_cellno = req.body.seller_cellno;
    const seller_address = req.body.seller_address;
    const seller_country = req.body.seller_country;
    const seller_city = req.body.seller_city;

    var errors = [];

    if (!seller_name || !seller_email || !seller_pass1 || !seller_pass2 || !seller_dob || !seller_cnic || !seller_country || !seller_cellno || !seller_address || !seller_city) {
        errors.push({ msg: 'Please fill all the fields' });
    }

    if (seller_pass1 != seller_pass2) {
        errors.push({ msg: 'Password do not match' });
    }

    if (seller_pass1.length < 6) {
        errors.push({ msg: 'Password length should not be less than 6 cahracters' });
    }

    if (errors.length > 0) {
        res.render('seller-register', { errors, seller_name, seller_email, seller_pass1, seller_pass2, seller_dob, seller_cnic, seller_country, seller_cellno, seller_address, seller_city });
    } else {
        Seller.findOne({ seller_email: req.body.seller_email }, function (err, docs) {
            if (docs) {
                errors.push({ msg: 'Email already exists' });
                res.render('seller-register', { errors, seller_name, seller_email, seller_pass1, seller_pass2, seller_dob, seller_cnic, seller_country, seller_cellno, seller_address, seller_city });
            }
            else {
                var seller = {
                    seller_name: req.body.seller_name,
                    seller_email: req.body.seller_email,
                    seller_pass: req.body.seller_pass1,
                    seller_dob: req.body.seller_dob,
                    seller_cnic: req.body.seller_cnic,
                    seller_cellno: req.body.seller_cellno,
                    seller_address: req.body.seller_address,
                    seller_country: req.body.seller_country,
                    seller_city: req.body.seller_city
                }
                const newseller = new Seller(seller);

                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newseller.seller_pass, salt, (err, hash) => {
                        if (err) throw err;
                        newseller.seller_pass = hash;
                        newseller.save();
                        req.flash('success_msg', 'You are now registered!');
                        res.redirect('/seller/login');
                    }));
            }
        });
    }
});

Router.post('/seller/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/seller/index',
        failureRedirect: '/seller/login',
        failureFlash: true
    })(req, res, next);
});

Router.get('/seller/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out successfully');
    res.redirect('/seller/login');
});

module.exports = Router;    