const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// require('mongoose-currency').loadType(mongoose);
// const Currency = mongoose.Types.Currency;

const roomSchema = new Schema({
    //would all these not be required because the user may not be selling a room?
    price: {
        type: Number,
        required: false,
        min: 0
    },
    street: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    br:{
        type: Number,
        required: false,
        min: 0,
        max: 6
    },
    baths: {
        type: Number,
        required: false,
        min: 0,
        max: 6
    },
    utilities: {
        type: Boolean,
        required: false
    },
    dishwasher: {
        type: Boolean,
        required: false
    },
    laundry: {
        type: Boolean,
        required: false
    },
    yard: {
        type: Boolean,
        required: false
    },
    porch: {
        type: Boolean,
        required: false
    },
    privateBath: {
        type: Boolean,
        required: false
    },
    roomDetails : {
        type: String,
        required: false
    },
    roomImg: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    male: {
        type: Boolean,
        required: true
    },
    female: {
        type: Boolean,
        required: true
    }, //IS THIS HOW YOU WOULD HANDLE RADIO BUTTON INPUTS?
    birthday: {
        type: Date,
        required: true
    },
    zip: {
        type: Number,
        required: true
    },
    zodiac: {
        type: String
    },
    socialHandle:{
        type: String
    },
    aboutme: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        required: true
    },
    //would I need this boolean to indicate if they are a room seller or not?
    roomSeller: {
        type: Boolean,
        required: true
    },
    savedRooms: [
        Schema.Types.ObjectId
    ],
    //when I pull the data do a serporate query for user id for rooms
    room: {
        type: roomSchema,
        required: false
    }},
 {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
//need capitalized singular version of name of model we want to use- mongoose will look for a plural lowcase
module.exports = User;