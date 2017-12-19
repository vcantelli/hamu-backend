// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var bcrypt   = require('bcrypt-nodejs');

// load up the user model
const Customers = require('../models').Customers;

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        Customers.find({
            where: {
                id: id
            }
        })
        .then(customer => {     
            done(null, customer.dataValues);
        })
        .catch(err => {
            done(err, null);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            Customers.find({
                where: {
                    email: email
                }
            })
            .then(customer => {   
                // check to see if theres already a user with that email
                if (customer) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    
                    var passwordBcrypt = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

                    Customers.create({
                        email: email,
                        password: passwordBcrypt,
                        bithDate: new Date(),
                        name: "Teste",
                        cpf: "54153423135",
                        sex: true,
                        telephone: "864654"
                    })
                    .then(customerCreated => 
                        done(null, customerCreated.dataValues)
                    )
                    .catch(err => 
                        done(err, null)
                    );
                }  
            })
            .catch(err => {
                done(err, null);
            });
        });
    }));
    
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        Customers.find({
            where: {
                email: email
            }
        })
        .then(customer => {   
            // if no user is found, return the message
            if (!customer)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                
            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, customer.password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, customer);
        })
        .catch(err => {
            done(err);
        });
    }));

};
