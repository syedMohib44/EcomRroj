module.exports = {
    database: 'mongodb://localhost:27017/shopdb',
    port: process.env.PORT || 28017,
    secretKey: "secret",
    facebook: {
        clientID: process.env.FACEBOOK_ID || '<facebook_id>',
        clientSecret: process.env.FACEBOOK_SECRET || '<facebook_secret_key>',
        profileFields: ['emails', 'displayName'],
        callbackURL: 'https://localhost/auth/facebook/callback'
    }
};