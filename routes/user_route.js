const express = require('express');
const Router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');
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
                var user = {
                    user_name: req.body.user_name,
                    user_email: req.body.user_email,
                    user_pass: req.body.user_pass1,
                    user_dob: req.body.user_dob,
                    user_vcode: req.body.user_vcode,
                }
                const newUser = new User(user);

                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.user_pass, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.user_pass = hash;
                        newUser.save();
                        req.flash('success_msg', 'You are now registered!');
                        res.redirect('/login');
                    }));
            }
        });
    }
});

//Now Authentication
Router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/index.html',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

Router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out successfully');
    res.redirect('/login');
});

module.exports = Router;    