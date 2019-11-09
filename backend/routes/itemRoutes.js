const router = require('express').Router();
const verify = require('./verifyToken');
const atob = require('atob');
const Item = require('../model/Item');
const {itemValidation} = require('../validation');
const User = require('../model/User');
const Rating = require('../model/Rating');
const mongoose = require('mongoose');
const opencage = require('opencage-api-client');
mongoose.set('useFindAndModify',false);
router.post('/registerItem',verify.user,async function(request, response){

    const token = request.cookies.token;
    const ca = token;
    const base64Url = ca.split('.')[1];
    const decodedValue = JSON.parse(atob(base64Url));
    console.log(decodedValue);
    console.log(decodedValue._id);


    //Lets validate the data before we make an item
    const {error} = itemValidation(request.body);
    if(error) {
        return response.status(400).json(error.details[0].message);
    }


    const sellerUserName = await User.findOne({userName: decodedValue._id});
    await console.log(sellerUserName.userName);

    //Create a new item in database
    const item = new Item({
        _idCreatedIt:decodedValue._id,
        Name: request.body.Name,
        Category: request.body.Category,
        Currently: request.body.First_Bid,
        Buy_Price: request.body.Buy_Price,
        First_Bid: request.body.First_Bid,
        Number_of_Bids: 0,
        Location:{
            Longtitude: request.body.Location.Longtitude,
            Latitude: request.body.Location.Latitude,
            Name: request.body.Location.Name
        },
        Country:request.body.Country,
        Started:request.body.Started,
        Ends:request.body.Ends,
        Seller: {
            userName: sellerUserName.userName,
            Rating: request.body.Seller.Rating
        },
        Description:request.body.Description,
        Image: request.body.Image
    });


    try {
        await item.save();
        response.json('Successfully created an item');
    }catch (err) {
        response.status(400).json(err);
    }
});


router.get('/getItems',async function (request,response) {
    try {
        const items = await Item.find(); // returns all items. .limit to limit them and many more options
        response.json(items);
    }catch (error) {
        response.json({message: error});
    }
});

router.post('/getSpecificItem',async function (request,response) {
    try {
        const item = await Item.findOne({_id: request.body._id}); // return item with _id = request.body._id
        response.json(item);
    }catch (error) {
        response.json({message: error});
    }
});
router.post('/findByCategory',async function (request,response) {
    try {
        const item = await Item.find({Category: request.body.Category});
        response.json(item);
    }catch (error) {
        response.json({message: error});
    }
});
router.post('/findByBuy_Price',async function (request,response) {
    try {
        const item = await Item.find({Buy_Price: request.body.Buy_Price});
        response.json(item);
    }catch (error) {
        response.json({message: error});
    }
});
router.post('/findByLocation',async function (request,response) {
    try {
        let returnedItems=[];
        const items = await Item.find();
        for(let i=0; i<items.length; i++){
            if(items[i].Location.Name===request.body.Location)
                returnedItems.push(items[i]);
        }
        response.json(returnedItems);
    }catch (error) {
        response.json({message: error});
    }
});
router.post('/findByDescription',async function (request,response) {
    try {
        let returnedItems=[];
        const items = await Item.find();
        for(let i=0; i<items.length; i++){
            if(items[i].Description.includes(request.body.Description)) {
                returnedItems.push(items[i]);
            }
        }
        response.json(returnedItems);
    }catch (error) {
        response.json({message: error});
    }
});
router.post('/findByName',async function (request,response) {
    try {
        let returnedItems=[];
        const items = await Item.find();
        for(let i=0; i<items.length; i++){
            if(items[i].Name === request.body.Name) {
                returnedItems.push(items[i]);
            }
        }
        response.json(returnedItems);
    }catch (error) {
        response.json({message: error});
    }
});
router.get('/getMyItems',verify.user,async function (request,response) {
    const token = request.cookies.token;
    const ca = token;
    const base64Url = ca.split('.')[1];
    const decodedValue = JSON.parse(atob(base64Url));
    console.log(decodedValue);
    console.log('EDW?'+decodedValue._id);
    try {
        const items = await Item.find({_idCreatedIt: decodedValue._id});
        console.log('tha steilw '+items);
        response.status(200).json(items);
    }catch (error) {
        console.log('tha steilw tipota');
        response.json(error);
    }
});

router.put('/UpdateItem',verify.user,async function (request,response) {

    try {
        console.log(request.body._id);
        console.log('old data '+ await Item.findOne({_id: request.body._id}));
        const data=await Item.findByIdAndUpdate(request.body._id,{
            Name: request.body.Name,
            Category: request.body.Category,
            Buy_Price: request.body.Buy_Price,
            First_Bid: request.body.First_Bid,
            Location:{
                Longtitude: request.body.Location.Longtitude,
                Latitude: request.body.Location.Latitude,
                Name: request.body.Location.Name
            },
            Country:request.body.Country,
            Started:request.body.Started,
            Ends:request.body.Ends,
            Description:request.body.Description,
            Image: request.body.Image
        },{new: true}); //request.body._id
        console.log('new data' + data);

        response.json('ola kala');
    }catch (error) {
        response.json({message: error});
    }
});
router.put('/setBidToItem',verify.user,async function (request,response) {
    const token = request.cookies.token;
    const ca = token;
    const base64Url = ca.split('.')[1];
    const decodedValue = JSON.parse(atob(base64Url));
    console.log(decodedValue);
    console.log('setbid'+decodedValue._id);
    try {
        const user = await User.findOne({userName: decodedValue._id});
        const ratingUser = await Rating.findOne({userName: user.userName});

        const Bid={
            Bidder:{
                userName: decodedValue._id,
                Rating: ratingUser.bidderPoints,
                Location: user.Location,
                Country: user.Country
            },
            Time: new Date(),
            Amount: request.body.Amount
        };


        await Item.findByIdAndUpdate(request.body._id,{
            "$push":{Bids: Bid}
        },{new: true});
        let itemForBid=await Item.findOne({_id: request.body._id});
        if(request.body.Amount>itemForBid.Currently)
            itemForBid.Currently=request.body.Amount;

        itemForBid.Number_of_Bids++;

        if(request.body.Amount === itemForBid.Buy_Price) {
            itemForBid.Purchased = true;
        }

        await Item.findByIdAndUpdate(request.body._id,{
            Number_of_Bids:itemForBid.Number_of_Bids,
            Currently:itemForBid.Currently,
            Purchased:itemForBid.Purchased
        },{new: true}); //request.body._id
        response.json('ola kala');
    }catch (error) {
        response.json({message: error});
    }
});
router.post('/deleteItem',verify.user,async function (request,response) {
    try {
        await Item.findByIdAndRemove(request.body._id);
        response.json('ola kala');
    }catch (error) {
        response.json({message: error});
    }
});

router.post('/itemCoords',async function (request,response) {
    console.log(request.body.adress);
    opencage.geocode({q: request.body.adress}).then(data => {
        if (data.status.code === 200) {
            if (data.results.length > 0) {
                const place = data.results[0];
                //console.log(place.formatted);
                response.json(place.geometry);
                //console.log(place.annotations.timezone.name);
            }
        } else if (data.status.code === 402) {
            console.log('hit free-trial daily limit');
            console.log('become a customer: https://opencagedata.com/pricing');
        } else {
            // other possible response codes:
            // https://opencagedata.com/api#codes
            console.log('error', data.status.message);
        }
    }).catch(error => {
        console.log('error', error.message);
    });
});

module.exports = router;