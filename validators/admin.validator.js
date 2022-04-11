const Joi = require('joi');

exports.validateAdminRegisteration = (body) => {
    const validAdminRegisterSchema = Joi.object({
        username: Joi.string().max(80).min(3).required(),
        email: Joi.string().min(5).required(),
        password: Joi.string().min(6).required(),
        profilePicture: Joi.string()
    })
    return validAdminRegisterSchema.validate(body);
}

exports.validateAdminAuthenatication = (body) => {
    const validAdminAuthenaticateSchema = Joi.object({
        email: Joi.string().max(80).min(5).required(),
        password: Joi.string().min(6).required()
    })
    return validAdminAuthenaticateSchema.validate(body);
}

exports.validateAdminUpdation = (body) => {
    const validateAdminUpdationSchema = Joi.object({
        email: Joi.string().max(80).min(5).required(),
        username: Joi.string().min(3).required()
    })
    return validateAdminUpdationSchema.validate(body);
}