const mongoose = require('mongoose');
const ratingSchema = new mongoose.Schema({
    userName:{
        type: String,
        required:true,
        max:255
    },
    sellerPoints: {
        type: Number,required: true
    },
    bidderPoints: {
        type: Number,required: true
    },
});

module.exports = mongoose.model('Rating',ratingSchema);