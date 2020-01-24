const express = require('express');
const Router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');
const Cart = require('../models/cart');

const { forwardAuthenticated } = require('../config/auth');


Router.get('/login', forwardAuthenticated, function (req, res) {
    res.render("user-login");
});

Router.get('/register', forwardAuthenticated, function (req, res) {
    res.render("user-register");
});
    
//Previos Authentication
// Router.post('/login', function (req, res) {
//     User.find(function (err, docs) {
//         console.log(docs[0] + " ");
//         if (req.body.user_name == docs.user_name && req.body.user_pass == docs.user_pass) {
//             res.redirect('/index.html');
//         }
//         else
//             res.redirect('/login.html');
//     });
// });

Router.post('/register', function (req, res) {
    const user_name = req.body.user_name;
    const user_email = req.body.user_email;
    const user_pass1 = req.body.user_pass1;
    const user_pass2 = req.body.user_pass2;
    const user_dob = req.body.user_dob;
    var errors = [];

    if (!user_name || !user_email || !user_pass1 || !user_pass2 || !user_dob) {
        errors.push({ msg: 'Please fill all the fields' });
    }

    if (user_pass1 != user_pass2) {
        errors.push({ msg: 'Password do not match' });
    }

    if (user_pass1.length < 6) {
        errors.push({ msg: 'Password length should not be less than 6 cahracters' });
    }

    if (errors.length > 0) {
        res.render('user-register', { errors, user_name, user_email, user_pass1, user_pass2 });
    } else {
        User.findOne({ user_email: req.body.user_email }, function (err, docs) {
            if (docs) {
                errors.push({ msg: 'Email already exists' });
                res.render('user-register', { errors, user_name, user_email, user_pass1, user_pass2 });
            }
            else {
                const newUser = new User();
                newUser.user_name = req.body.user_name;
                newUser.user_email = req.body.user_email;
                newUser.user_pass = req.body.user_pass1;
                newUser.user_picture = newUser.gravatar();
                newUser.user_address = req.body.user_address;
                newUser.user_dob = req.body.user_dob;
                newUser.user_vcode = req.body.user_vcode;

                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.user_pass, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.user_pass = hash;
                        newUser.save();
                        //req.flash('success_msg', 'You are now registered!');
                        //res.redirect('/login');
                }));
                const cart = new Cart();
                cart.owner = newUser._id;
                cart.save(function(err) {
                    req.logIn(newUser, function(err){
                        if(err) return next(err);
                        req.flash('success_msg', 'You are now registered!');
                        res.redirect('/login');
                    })
                })
            }
        });
    }
});

Router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'user_email'}));

Router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/index.html',
    failureRedirect: '/login'
}));

//Now Authentication
Router.post('/login', function (req, res, next) {
    var hour = 3600000; //when maxAge is set to 60000 (one minute), and 30 seconds. 
    req.session.cookie.expires = new Date(Date.now() + hour); //req.session.cookie.maxAge will return the time remaining in milliseconds.
    req.session.cookie.maxAge = hour;

    passport.authenticate('local', {
        successRedirect: '/index.html',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

Router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    req.flash('success_msg', 'You are logged out successfully');
    res.redirect('/login');
});

module.exports = Router;    