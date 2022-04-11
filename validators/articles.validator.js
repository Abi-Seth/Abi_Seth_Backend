const Joi = require('joi');

exports.validateArticleRegisteration = (body) => {
    const validArticleRegisterSchema = Joi.object({
        articleTitle: Joi.string().required().max(150).min(2),
        articleDescription: Joi.string().min(5).max(500).required(),
        articleContent: Joi.string().min(5).max(5000).required(),
        articleMainImage: Joi.string().required() 
    })
    return validArticleRegisterSchema.validate(body);
}