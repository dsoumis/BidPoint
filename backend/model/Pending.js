const mongoose = require('mongoose');
const pendingUser = new mongoose.Schema({
    userName:{
        type: String,
        required:true,
        max:255
    },
    password:{
        type: String,
        required:true,
        max:1024,
        min: 6
    },
    name:{
        type: String,
        required:true,
        max:255
    },
    surName:{
        type: String,
        required:true,
        max:255
    },
    email:{
        type: String,
        required:true,
        max:255,
        min:6
    },
    phoneNumber:{
        type: String,
        required:true,
        max:255,
        min:6
    },
    physicalAddress:{
        type: String,
        required:true,
        max:255,
        min:6
    },
    Location:{type: String, required: true},
    Country:{
        type: String,
        required:true,
        max:90,
        min:2
    },
    afm:{
        type: String,
        required:true,
        max:255,
        min:6
    }
});

module.exports = mongoose.model('PendingUser',pendingUser);