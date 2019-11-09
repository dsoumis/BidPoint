const router = require('express').Router();
const verify = require('./verifyToken');
const atob = require('atob');
const User = require('../model/User');
const Message = require('../model/Message');
const mongoose = require('mongoose');

router.get('/getMyMessages',verify.user,async function (request,response) {
    const token = request.cookies.token;
    const ca = token;
    const base64Url = ca.split('.')[1];
    const decodedValue = JSON.parse(atob(base64Url));
    try {
        const messages = await Message.findOne({userName: decodedValue._id});
        response.json(messages);
    }catch (error) {
        response.json(error);
    }
});

router.post('/sendMessage',verify.user,async function (request,response) {
    const token = request.cookies.token;
    const ca = token;
    const base64Url = ca.split('.')[1];
    const decodedValue = JSON.parse(atob(base64Url));
    console.log(decodedValue);
    console.log(decodedValue._id);

    try {
        //Update sender's outbox
        const messages = await Message.updateOne({userName: decodedValue._id},{ $push: {Sent: request.body.Sent} });
        //Update receiver's inbox
        await Message.updateOne({userName: request.body.Sent.To},{ $push: {Inbox: {
                    Message: request.body.Sent.Message,
                    Read: false,
                    From: decodedValue._id
                }} });
        ////Update receiver's unread variable
        let receiver = await Message.findOne({userName: request.body.Sent.To});
        if(receiver.Unread===null)
            receiver.Unread = 1;
        else
            receiver.Unread++;
        await Message.updateOne({userName: request.body.Sent.To},{Unread: receiver.Unread});
        response.json('all good');
    }catch (error) {
        response.json(error);
    }
});
router.post('/readMessage',verify.user,async function (request,response) {
    const token = request.cookies.token;
    const ca = token;
    const base64Url = ca.split('.')[1];
    const decodedValue = JSON.parse(atob(base64Url));
    try {
        //Find user
        let user = await Message.findOne({userName: decodedValue._id});

        const id = mongoose.Types.ObjectId(request.body._id);
        for(let i=0; i<user.Inbox.length; i++){
            if(user.Inbox[i]._id.equals(id)) {
                if(user.Inbox[i].Read === false) {
                    user.Inbox[i].Read = true;
                    user.Unread--;
                }
            }
        }
        console.log(user.Unread);
        await Message.updateOne({userName: decodedValue._id},{
            Unread:user.Unread,
            Inbox:user.Inbox
        });
        response.json('ola kala');
    }catch (error) {
        response.json(error);
    }
});
router.post('/getSpecificMessage',async function (request,response) {
    const token = request.cookies.token;
    const ca = token;
    const base64Url = ca.split('.')[1];
    const decodedValue = JSON.parse(atob(base64Url));
    try {
        const user = await Message.findOne({userName: decodedValue._id});
        const id = mongoose.Types.ObjectId(request.body._id);
        for(let i=0; i<user.Inbox.length; i++){
            if(user.Inbox[i]._id.equals(id)) {
                response.json(user.Inbox[i]);
            }
        }

        for(let i=0; i<user.Sent.length; i++){
            if(user.Sent[i]._id.equals(id)) {
                response.json(user.Sent[i]);
            }
        }
    }catch (error) {
        response.json({message: error});
    }
});
router.post('/deleteMessage',async function (request,response) {
    const token = request.cookies.token;
    const ca = token;
    const base64Url = ca.split('.')[1];
    const decodedValue = JSON.parse(atob(base64Url));
    try {
        //Find user
        let user = await Message.findOne({userName: decodedValue._id});

        const id = mongoose.Types.ObjectId(request.body._id);
        for(let i=0; i<user.Inbox.length; i++){
            if(user.Inbox[i]._id.equals(id)) {
                user.Inbox.splice(i, 1);
                break;
            }
        }
        for(let i=0; i<user.Sent.length; i++){
            if(user.Sent[i]._id.equals(id)) {
                user.Sent.splice(i, 1);
                break;
            }
        }
        await Message.updateOne({userName: decodedValue._id},{
            Inbox:user.Inbox,
            Sent:user.Sent
        });
        response.json('ola kala');
    }catch (error) {
        response.json(error);
    }
});
module.exports = router;