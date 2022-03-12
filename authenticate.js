const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Accounts = require('./models/accounts');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config.js');

exports.local = passport.use(new LocalStrategy(Accounts.authenticate()));
passport.serializeUser(Accounts.serializeUser());
passport.deserializeUser(Accounts.deserializeUser());

exports.getToken = function(Accounts) {
    return jwt.sign(Accounts, config.secretKey, {expiresIn: 3600});
    //will take Accounts obj and secret key from config as well as expire boolean 
    //if you dont use expires argument the token will never expire
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//gets token from the request auth header as a bearer token
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            Accounts.findOne({_id: jwt_payload._id}, (err, Accounts) => {
                if (err) {
                    return done(err, false);
                } else if (Accounts) {
                    return done(null, Accounts);//null=no error Accounts=Accounts document
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.verifyAdmin = function (req, res, next) {
    if (req.Accounts.admin === true) {
      return next();
    } else {
      const err = new Error('You are not authorized to perform this operation!');
      err.status = 403;
      return next(err);
    }
  };

exports.verifyAccounts = passport.authenticate('jwt', {session: false});