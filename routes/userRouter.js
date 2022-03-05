const express = require('express');
const User = require('../models/user');
const userRouter = express.Router();

//this will go through all of the users and send user info depending on id that is logged in

userRouter.route('/')
.get((req, res, next) => {
    User.find()
    .then(users => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    })
    .catch(err => next(err)); //handles errors
})
.post((req, res, next) => { //this is where a user creating an account would post
    User.create(req.body)
    .then(user => {
        console.log('User Created ', user);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user); //sends info about posted document to client
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /user');
})
.delete((req, res, next) => {
    User.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//connecting to specified id within a document
userRouter.route('/:userId')
.get((req, res, next) => {
    User.findById(req.params.userId)
    .then(user => {
        User.find({userId: {$in: user.savedRooms}})
        .then(users => {
            user.savedRoomsDetails = users;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);
        })
    })
    //this query now will find the user thats logged in data as well as the data for all of the users of the rooms they saved
    .catch(err => next(err));
})
.post((req, res) => { //would I need post for indv user id?
    res.statusCode = 403;
    res.end(`POST operation not supported on /user/${req.params.userId}`);
})
.put((req, res, next) => {
    User.findByIdAndUpdate(req.params.userId, { //edit profile and saved rooms
        $set: req.body
    }, { new: true })
    .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    User.findByIdAndDelete(req.params.userId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = userRouter;