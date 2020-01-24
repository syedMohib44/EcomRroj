const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
//const FacebookStrategy = require('passport-facebook').Strategy;
//const secret = require('../config/secret');
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

//TODO: add login with facebook.

// module.exports = function (passport) {
//     passport.use(new FacebookStrategy(secret.facebook, (token, refreshToken, profile, done) => {

//     User.findOne({facebook: profile.id}, function(err, user) {
//         if (err) return next(err);

//         if (user) {
//             return done(null, user);
//         } else {
//             async.waterfall([
//                 (callback) => {
//                     const newUser = new User();
//                     newUser.name = profile.displayName;
//                     newUser.email = profile._json.email;
//                     newUser.facebook = profile.id;
//                     newUser.tokens.push({kind: 'facebook', token: token});
//                     newUser.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';

//                     newUser.save((err) => {
//                         if (err) return next(err);
//                         callback(err, newUser._id);
//                     })
//                 },
//                 (newUser) => {
//                     const cart = new Cart();

//                     cart.owner = newUser._id;
//                     cart.save((err) => {
//                         if (err) return done(err);
//                         return done(err, newUser);
//                     });
//                 }
//             ]);

//         }
//     });
// }));
// }