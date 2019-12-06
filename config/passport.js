const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/user');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'user_email', passwordField: 'user_pass' }, function (user_email, user_pass, done) {
            // Match User
            User.findOne({ user_email: user_email }, function (err, docs) {
                console.log(user_email + " - " + docs.user_email);
                if (!docs) {
                    return done(null, false, { message: 'That email is not registered' });
                }
                bcrypt.compare(user_pass, docs.user_pass, function (err, isMatch) {
                    if (err) throw err;
                    
                    if (isMatch) {
                        console.log(user_pass + " - " + docs.user_pass);
                        return done(null, docs);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            });
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};