const router = require('express').Router();
const verify = require('./verifyToken');
const atob = require('atob');
const User = require('../model/User');
const Message = require('../model/Message');
const mongoose = require('mongoose');
const builder = require('xmlbuilder');
const Item = require('../model/Item');
const fs = require('fs');
const xml2js = require('xml2js');
router.post('/convertToXml',verify.admin,async function (req,res) {
    try {
        const item = await Item.findOne({_id: req.body._id}); // return item with _id = request.body._id
        item["Image"]=undefined;

        item["_idCreatedIt"]=undefined;
        item["__v"]=undefined;
        res.send(item);

        const root = builder.create('Item', ).att({'ItemID': item._id});
        root.ele('Name',item.Name);
        const numberOfCategories = item.Category.length;
        for(let i=0; i<numberOfCategories; i++){
            root.ele('Category',item.Category[i]);
        }
        root.ele('Currently','$'+item.Currently);
        root.ele('Firts_Bid','$'+item.First_Bid);
        root.ele('Number_of_Bids',item.Number_of_Bids);
        const numberOfBids = item.Bids.length;

        let array=[];
        for(let i=0; i<numberOfBids; i++){
            const obj = {
                Bid:{
                    Bidder: {
                        '@Rating': item.Bids[i].Bidder.Rating,
                        "@UserID": item.Bids[i].Bidder.userName,
                        Location: item.Bids[i].Bidder.Location,
                        Country: item.Bids[i].Bidder.Country
                    },
                    Time: item.Bids[i].Time.toISOString().replace(/T/, ' ').replace(/\..+/, '')  ,
                    Amount: '$'+item.Bids[i].Amount
                }
            };
            array.push(obj);
        }
        root.ele('Bids').ele(array);
        root.ele('Location',{'Longtitude':item.Location.Longtitude,'Latitude':item.Location.Latitude},item.Location.Name);
        root.ele('Country',item.Country);
        root.ele('Started',item.Started.toISOString().replace(/T/, ' ').replace(/\..+/, ''));
        root.ele('Ends',item.Ends.toISOString().replace(/T/, ' ').replace(/\..+/, ''));
        root.ele('Description',item.Description);
        const xml=root.end({ pretty: true});
        console.log(xml);
        fs.appendFile('../downloads/'+item._id+'.xml', xml, function (err) {
            if (err) throw err;               console.log('Results Received');
        });

    }catch (error) {
        console.log({message: error});
    }

});

router.post('/convertToJSON',verify.admin,async function (req,res) {
    try {
        const item = await Item.findOne({_id: req.body._id}); // return item with _id = request.body._id
        item["Image"]=undefined;

        item["_idCreatedIt"]=undefined;
        item["__v"]=undefined;
        res.send(item);

        const root = builder.create('Item', ).att({'ItemID': item._id});
        root.ele('Name',item.Name);
        const numberOfCategories = item.Category.length;
        for(let i=0; i<numberOfCategories; i++){
            root.ele('Category',item.Category[i]);
        }
        root.ele('Currently','$'+item.Currently);
        root.ele('Firts_Bid','$'+item.First_Bid);
        root.ele('Number_of_Bids',item.Number_of_Bids);
        const numberOfBids = item.Bids.length;

        let array=[];
        for(let i=0; i<numberOfBids; i++){
            const obj = {
                Bid:{
                    Bidder: {
                        '@Rating': item.Bids[i].Bidder.Rating,
                        "@UserID": item.Bids[i].Bidder.userName,
                        Location: item.Bids[i].Bidder.Location,
                        Country: item.Bids[i].Bidder.Country
                    },
                    Time: item.Bids[i].Time.toISOString().replace(/T/, ' ').replace(/\..+/, '')  ,
                    Amount: '$'+item.Bids[i].Amount
                }
            };
            array.push(obj);
        }
        root.ele('Bids').ele(array);
        root.ele('Location',{'Longtitude':item.Location.Longtitude,'Latitude':item.Location.Latitude},item.Location.Name);
        root.ele('Country',item.Country);
        root.ele('Started',item.Started.toISOString().replace(/T/, ' ').replace(/\..+/, ''));
        root.ele('Ends',item.Ends.toISOString().replace(/T/, ' ').replace(/\..+/, ''));
        root.ele('Description',item.Description);
        const xml=root.end({ pretty: true});
        //console.log(xml);
        xml2js.parseString(xml, function (err, result) {
            console.log(result.root);

            const json = JSON.stringify(result);

            console.log(json);
            fs.appendFile('../downloads/'+item._id+'.json', json, function (err) {
                if (err) throw err;               console.log('Results Received');
            });
        });


    }catch (error) {
        console.log({message: error});
    }

});

module.exports = router;