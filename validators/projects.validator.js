const Joi = require('joi');

exports.validateProjectRegisteration = (body) => {
    const validProjectRegisterSchema = Joi.object({
        projectTitle: Joi.string().required().max(150).min(2),
        projectDescription: Joi.string().min(5).max(500).required(),
        projectContent: Joi.string().min(5).max(5000).required(),
        projectMainImage: Joi.string().required(),
        projectLinks: Joi.array().required()
    })
    return validProjectRegisterSchema.validate(body);
}