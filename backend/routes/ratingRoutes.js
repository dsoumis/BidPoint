const router = require('express').Router();
const verify = require('./verifyToken');
const atob = require('atob');
const Rating = require('../model/Rating');
const User = require('../model/User');
router.get('/getRating',verify.user,async function (request,response) {

    const token = request.cookies.token;
    const ca = token;
    const base64Url = ca.split('.')[1];
    const decodedValue = JSON.parse(atob(base64Url));
    console.log(decodedValue);
    console.log(decodedValue._id);

    try {
        const user = await User.findOne({userName: decodedValue._id});
        console.log(user);


        try {
            const ratingUser = await Rating.findOne({userName: user.userName});
            response.json(ratingUser);
        }catch (error) {
            response.json({message: error});
        }

    }catch (error) {
        response.json({message: error});
    }
});
router.post('/getSpecificRating',async function (request,response) {

        try{
            const ratingUser = await Rating.findOne({userName:request.body.userName});
            response.json(ratingUser);
        }catch (error) {
            response.json({message: error});
        }


});
router.put('/RateSeller',verify.user,async function (request,response) {

    try {
        const sellerToRate = await Rating.findOne({userName: request.body.userName});
        console.log(sellerToRate);
        sellerToRate.sellerPoints++;

        try {
            await Rating.updateOne({userName: request.body.userName},{sellerPoints: sellerToRate.sellerPoints});
            response.status(200).json('all good');
        }catch (error) {
            response.json({message: error});
        }

    }catch (error) {
        response.json({message: error});
    }
});
router.put('/RateBidder',verify.user,async function (request,response) {
    const token = request.cookies.token;
    const ca = token;
    const base64Url = ca.split('.')[1];
    const decodedValue = JSON.parse(atob(base64Url));
    console.log(decodedValue);
    console.log(decodedValue._id);
    try {
        const bidderToRate = await Rating.findOne({userName: decodedValue._id});
        console.log(bidderToRate);
        bidderToRate.bidderPoints++;

        try {
            await Rating.updateOne({userName: decodedValue._id},{bidderPoints: bidderToRate.bidderPoints});
            response.status(200).json('all good');
        }catch (error) {
            response.json({message: error});
        }

    }catch (error) {
        response.json({message: error});
    }
});

module.exports = router;