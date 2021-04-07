const Joi = require('joi')

const schemas = {
    rooftopPOST: Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.string().required(),
        image: Joi.string().required(),
        desc: Joi.string().required().min(5),
        address: Joi.string().required(),    
    }),

    reviewPOST: Joi.object().keys({
        text: Joi.string().min(10).required(),
        rating: Joi.number().min(1).max(5).required()
    })
}

module.exports = schemas;