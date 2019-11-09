const router = require('express').Router();
const verify = require('./verifyToken');
router.get('/posts',verify.user,function (request,response) {
   response.json({posts: {title: 'my first post', description: 'random data you shouldnt access'}})
});
router.get('/checkUserToken', verify.user, function(req, res) {
   res.sendStatus(200);
});
router.get('/checkUserToken', verify.user, function(req, res) {
   res.sendStatus(200);
});

router.get('/checkAdminToken', verify.admin, function(req, res) {
   res.sendStatus(200);
});


const User = require('../model/User');
const PendingUser = require('../model/Pending');
const Rating = require('../model/Rating');
const Message = require('../model/Message');
const atob = require('atob');
router.post('/adminApprove', verify.admin, async function(request, response) {
   //Checking if the user is already in the database
   const emailExist = await User.findOne({email:request.body.email});
   if(emailExist) return response.status(400).json('Email already exists! Please give another email.');
   const userNameExist = await User.findOne({userName:request.body.userName});
   if(userNameExist) return response.status(400).json('Username already exists! Please give another username.');
   const user = new User({
      userName: request.body.userName,
      password: request.body.password,
      name: request.body.name,
      surName: request.body.surName,
      email: request.body.email,
      phoneNumber: request.body.phoneNumber,
      physicalAddress: request.body.physicalAddress,
      Location:request.body.location,
      Country:request.body.country,
      afm: request.body.afm
   });
   const userRating = new Rating({
      userName: request.body.userName,
      sellerPoints: 0,
      bidderPoints: 0
   });
   const userMessages = new Message({
      userName: request.body.userName,
      Unread: 0
   });
   try {
      await user.save();
      await userRating.save();
      await userMessages.save();
      await PendingUser.deleteOne({userName: request.body.userName});
      response.json('Successfully created an account in the main database');
   }catch (err) {
      response.status(400).json(err);
   }
});
router.post('/adminReject', verify.admin, async function(request, response) {
   try {
      await PendingUser.deleteOne({userName: request.body.userName});
      response.json('Successfully rejected the account');
   }catch (err) {
      response.status(400).json(err);
   }
});
router.get('/getUsers',verify.admin,async function (request,response) {
   try {
      const users = await User.find(); // returns all users. .limit to limit them and many more options
      response.json(users);
   }catch (error) {
      response.json({message: error});
   }
});
router.get('/getSpecificUserByID',verify.user,async function (request,response) {
   const token = request.cookies.token;
   const ca = token;
   const base64Url = ca.split('.')[1];
   const decodedValue = JSON.parse(atob(base64Url));
   console.log(decodedValue);
   console.log(decodedValue._id);
   try {
      const user = await User.findOne({userName: decodedValue._id});
      response.json(user);
   }catch (error) {
      response.json(error);
   }
});
router.get('/getPendingUsers',verify.admin,async function (request,response) {
   try {
      const pendingUsers = await PendingUser.find(); // returns all users. .limit to limit them and many more options
      response.json(pendingUsers);
   }catch (error) {
      response.json({message: error});
   }
});
module.exports = router;