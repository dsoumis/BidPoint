const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    _idCreatedIt:{type:String,required:true},
    Name:{type: String,required:true,max:100},

    Category: [
        {type: String, required:true,max:100,min:3}
     ],

    Currently:{
        type: Number,
        required:true,
    },

    Buy_Price:{
        type: Number,
    },
    First_Bid:{
        type: Number,
        required:true,
    },
    Number_of_Bids:{type:Number,required:true},
    Bids:[{
        Bidder: {
            userName: { type: String,max:255},
            Rating: {type:Number},
            Location: { type: String,max:255},
            Country: { type: String,max:255},
        },
        Time: {type: Date},
        Amount: {type: Number}
    }],
    Location:{
        Longtitude: {type: Number,default: ''},
        Latitude: {type: Number,default: ''},
        Name: {type: String, required: true}
    },
    Country:{
        type: String,
        required:true,
        max:90,
        min:2
    },
    Started:{
        type: Date,  //eg '2002-12-09'
        required:true
    },
    Ends:{
        type: Date,
        required:true
    },
    Seller: {
        userName: { type: String,required:true,max:255},
        Rating: {type:Number,required:true}
    },
    Description:{
        type:String,required:true
    },
    Image: [
        {
            imageName: {
                type: String,
                default: "none",
            },
            imageData: {
                type: String,
            }
        }
    ],
    Purchased:{type: Boolean,required:true,default:false}
});




module.exports = mongoose.model('Item',itemSchema);