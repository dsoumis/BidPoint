//Validation
const Joi = require('@hapi/joi');

function registerValidation(data) {

    //Register Validation
    const schema = {
        userName: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().min(6).required(),
        name: Joi.string().min(6).required(),
        surName: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        phoneNumber: Joi.string().min(6).required(),
        physicalAddress: Joi.string().min(6).required(),
        location: Joi.string().required(),
        country:Joi.string().max(90).min(2).required(),
        afm: Joi.string().min(6).required()
    };

    return Joi.validate(data,schema);
}
function loginValidation(data) {

    //Login Validation
    const schema = {
        userName: Joi.string().min(6).required(),
        password: Joi.string().min(6).required()
    };

    return Joi.validate(data,schema);
}
function itemValidation(data) {

    //Item Validation
    const schema = {
        Name: Joi.string().max(100).required(),
        Category: Joi.array().items(Joi.string()),
        Buy_Price:Joi.number(),
        First_Bid: Joi.number().required(),
        Bids:Joi.array().items(Joi.object({
            Bidder: {
                userName: Joi.string().max(255),
                Rating: Joi.number(),
                Location: Joi.string().max(255),
                Country: Joi.string().max(255),
            },
            Time: Joi.string(), //package for date,phonumber
            Amount: Joi.number()
        })),
        Location:{
            Longtitude: Joi.string().allow(''),
            Latitude: Joi.string().allow(''),
            Name: Joi.string().required()
        },
        Country:Joi.string().max(90).min(2).required(),
        Started:Joi.string().required(),
        Ends:Joi.string().required(),
        Seller: {
            userName: Joi.string().max(255),
            Rating: Joi.number().required()
        },
        Description: Joi.string().required(),
        Image: Joi.array().items()
    };

    return Joi.validate(data,schema);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.itemValidation = itemValidation;