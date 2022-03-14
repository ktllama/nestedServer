const express = require('express');
const Accounts = require('../models/accounts');
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();

/* GET Accountss listing. */


router.get('/', authenticate.verifyAccounts, authenticate.verifyAdmin, function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/create-account', (req, res) => {
    Accounts.register(
        new User({username: req.body.username}),
        req.body.password,
        (err, Accounts) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else {
                if (req.body.firstname) {
                    Accounts.firstname = req.body.firstname;
                }
                if (req.body.lastname) {
                    Accounts.lastname = req.body.lastname;
                }
                Accounts.save(err => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err});
                        return;
                    }
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Registration Successful!'});
                    });
                });
            }
        }
    );
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    const token = authenticate.getToken({_id: req.accounts._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res, next) => { //logout Accounts- stop tracking session
    if (req.session) {
        req.session.destroy(); //delete file on server side
        res.clearCookie('session-id');
        res.redirect('/');
    } else { //if session doesnt exist
        const err = new Error('You are not logged in!');
        err.status = 401;
        return next(err);
    }
});

module.exports = router;