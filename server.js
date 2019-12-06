const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var app = express();
const mongoose = require('./server/shop_database');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

app.engine('ejs', require('ejs-locals'));
require('./config/passport')(passport);
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));
//app.set('views', (path.join(__dirname, './views/'))); // will go to views on start sever for rendering...
app.use( express.static(path.join( __dirname, './views')));

//Expression session middleware
app.use(
    session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    //cookie:{secure:true}this is causing trouble for now will fix it later...
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
  
const users = require('./routes/user_route');
const seller = require('./routes/seller_route');
const products = require('./routes/products_route');
const products_types = require('./routes/product_type_route');
const custome_products = require('./routes/custom_product_route');
const seller_products = require('./routes/seller_product_route');


app.use('/',products, products_types, users, seller, custome_products, seller_products);

app.post('/form', function(req, res){
    var name = req.body.Name;
    console.log(name);
    var sql = "Update person set ?";
    db.query(sql, req, function(error, result){
    
        if(error) console.log('error update' + error);
        else console.log('Post query Successful');
    });
});

 app.listen('28017', () => {
     console.log('Server started on port 28017');
});