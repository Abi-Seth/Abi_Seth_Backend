const Joi = require('joi');

exports.validateMessage = (body) => {
    const validMessageSchema = Joi.object({
        messageNames: Joi.string().max(50).min(3).required(),
        messageEmail: Joi.string().max(50).min(5).required(),
        messageContent: Joi.string().max(500).min(10).required(),
        messageAnswered: Joi.string().max(3).min(2).valid('yes','no')
    })
    return validMessageSchema.validate(body);
}

exports.validateMessageAnswer = (body) => {
    const validMessageAnswerSchema = Joi.object({
        answerId: Joi.string().max(25).min(15).required(),
        messageNames: Joi.string().max(50).min(5).required(),
        messageEmail: Joi.string().max(50).min(5).required(),
        messageHeading: Joi.string().max(80).min(10).required(),
        messageContent: Joi.string().max(500).min(10).required(),
        messageAnswered: Joi.string().max(3).min(2).valid('yes','no')
    })
    return validMessageAnswerSchema.validate(body);
}