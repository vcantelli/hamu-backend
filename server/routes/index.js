const Inventions = require('../models').Inventions;
const Categories = require('../models').Categories;
const InventionImages = require('../models').InventionImages;
var Sequelize = require('sequelize');
var base64Img = require('base64-img');

module.exports = function(app, passport) {
    app.get('/', (req, res) => res.render('index.ejs', { title: 'Evnts' }));
    
    app.get('/dashboard', isLoggedIn, function(req, res, next) { 
        if (req.user) {
            res.render('dashboard.ejs', { title: 'Evnts' })
        } else {
            res.render('index.ejs', { title: 'Evnts' });
        }
    });
    
    app.get('/dashboard', passport.authenticate('local-login', {
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    app.get('/inventions/:categoryName', (req, res) => {             
        const categoryName = req.params.categoryName;
        if(categoryName){
            return Categories
            .find({
                where:{
                    name: categoryName
                }
            })
            .then(category => {
                Inventions
                .findAll({
                    where: {
                        CategoryId: category.dataValues.id
                    },
                    include: [{
                        model: Categories,
                        as: 'Categories',
                        attributes: ['name']
                    }],
                    include: [{
                        model: InventionImages,
                        as: 'InventionImages',
                        attributes: ['image']
                    }]
                })
                .then(customers =>                    
                        res.render('inventions.ejs', { title: 'Evnts', data: customers})                    
                )
                .catch(err => 
                    res.status(500).send(err)
                );
            })
            .catch(err => 
                res.status(500).send(err)
            );
        }
        res.status(500).send()
    });
    
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {        
                // render the page and pass in any flash data if it exists
                res.render('login.ejs', { message: req.flash('loginMessage') }); 
            });
        
            // process the login form
            // app.post('/login', do all our passport stuff here);
        
            // =====================================
            // SIGNUP ==============================
            // =====================================
            // show the signup form
            app.get('/signup', function(req, res) {
        
                // render the page and pass in any flash data if it exists
                res.render('signup.ejs', { message: req.flash('signupMessage') });
            });

            // process the signup form
            app.post('/signup', passport.authenticate('local-signup', {
                successRedirect : '/', // redirect to the secure profile section
                failureRedirect : '/signup', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
            }));
                
            // =====================================
            // LOGOUT ==============================
            // =====================================
            app.get('/logout', function(req, res) {
                req.logout();
                res.redirect('/');
            });

            // process the login form
            app.post('/login', passport.authenticate('local-login', {
                successRedirect : '/dashboard', // redirect to the secure profile section
                failureRedirect : '/login', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
            }));
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();
    
        // if they aren't redirect them to the home page
        res.redirect('/');
    }
    