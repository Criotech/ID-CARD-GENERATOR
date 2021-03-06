let passport = require("passport");
let LocalStrategy = require('passport-local').Strategy;


let User = require('../models/users');


passport.serializeUser(function(user, done){
    done(null, user.id)
})

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    })
})

passport.use('local.registerAdmin', new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, function(req, email, password, done){
    User.findOne({'email': email}, function(err, user){
        if (err){
            return done(err);
        }
        if (user){
            return done(null, false)
        }

        let newUser = new User();
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.logo =req.body.logo;
        newUser.password = newUser.generateHash(req.body.password);
        newUser.role = req.body.role;

        newUser.save(function(err){
            if (err){
                return done(err)
            }
            req.flash('success', "Account created successfully")
            return done(null, newUser)
        })
    })
}))


passport.use('local.loginAdmin', new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, function(req, email, password, done){
    User.findOne({'email': email, "role": "admin"}, function(err, user){
        if (err){
            return done(err);
        }
        if (!user){
            req.flash('loginError', "Invalid LogIn")
            return done(null, false)
        }

        if(!user.validatePassword(req.body.password)) {
            req.flash('wrongMatric', "Wrong Password")
            return done(null, false)
        }

        return done(null, user)

    })
}))
