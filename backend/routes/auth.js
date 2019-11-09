const router = require('express').Router();
const User = require('../model/User');
const PendingUser = require('../model/Pending');
const {registerValidation,loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const atob = require('atob');
router.post('/register',async function (request,response) {

    //Lets validate the data before we make a user
    const {error} = registerValidation(request.body);
    if(error) {
        return response.status(400).json(error.details[0].message);
    }

    //Checking if the user is already in the database
    const emailExist = await User.findOne({email:request.body.email});
    if(emailExist) return response.status(400).json('Email already exists! Please give another email.');
    const userNameExist = await User.findOne({userName:request.body.userName});
    if(userNameExist) return response.status(400).json('Username already exists! Please give another username.');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(request.body.password,salt);
    const hashedConfirmedPassword = await bcrypt.hash(request.body.confirmPassword,salt);

    if(!(hashedPassword === hashedConfirmedPassword))
        return response.status(400).json('The fields of Password and Confirm Password must match!');


    //Create a new user pending for accept from admin
    const pendingUser = new PendingUser({
        userName: request.body.userName,
        password: hashedPassword,
        name: request.body.name,
        surName: request.body.surName,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
        physicalAddress: request.body.physicalAddress,
        Location:request.body.location,
        Country:request.body.country,
        afm: request.body.afm
    });

    try {
        await pendingUser.save();
        response.json('Successfully created an account');
    }catch (err) {
        response.status(400).json(err);
    }

});


router.post('/login',async function (request,response) {
    //Lets validate the data before we enter a user
    const {error} = loginValidation(request.body);
    if(error) {
        return response.status(400).json(error.details[0].message);
    }

    //Checking if the username exists
    const user = await User.findOne({userName:request.body.userName});
    if(!user) return response.status(400).json('Username doesn\'t exist.');

    //Password is correct?
    const validPass = await bcrypt.compare(request.body.password,user.password);
    if(!validPass)  return response.status(400).json('Invalid Password.');


    if(request.body.userName === 'bidpointadmin') {
        //Create and assign authentication token for admin
        const token = jwt.sign({_id: user.userName}, process.env.TOKEN_SECRET);
        response.cookie('adminToken', token, {httpOnly: true}).json('Logged In Admin!');
    }else {
        //Create and assign authentication token for users
        const token = jwt.sign({_id: user.userName}, process.env.TOKEN_SECRET);
        response.cookie('token', token, {httpOnly: true}).json('Logged In!'); //json(token)+
        const ca = token;
        const base64Url = ca.split('.')[1];
        const decodedValue = JSON.parse(atob(base64Url));
        console.log(decodedValue);
        console.log(decodedValue._id);
    }
});
router.post('/logout', function (request,response) {
    response.cookie('token',{expires: Date.now()}).json('Logged Out!');
});

router.post('/logoutAdmin', function (request,response) {
    response.cookie('adminToken',{expires: Date.now()}).json('Logged Out!');
});


module.exports = router;