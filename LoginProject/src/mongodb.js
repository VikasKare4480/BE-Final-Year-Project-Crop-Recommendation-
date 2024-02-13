const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/LoginSignup')
    .then(() => {

        console.log("mongodb Connected")
    })
    .catch(() => {

        console.log("failed to connect");
    })

const LogInSchema = new mongoose.Schema({
    name: {

        type: String,
        required: true
    },

    email: {

        type: String,
        required: true
    },

    mobile: {

        type: Number,
        required: true
    },

    password: {

        type: String,
        required: true
    },

    cpassword: {

        type: String,
        required: true
    },


    fimg: {

        type: String,
        required: true
    },

    seventimg: {

        type: String,
        required: true
    },

    eightAimg: {

        type: String,
        required: true
    }
})

const collection = new mongoose.model("FarmerDataCollection", LogInSchema)

module.exports = collection;