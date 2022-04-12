const Joi = require('joi');

exports.validateArticleRegisteration = (body) => {
    const validArticleRegisterSchema = Joi.object({
        articleTitle: Joi.string().required().max(150).min(2),
        articleDescription: Joi.string().min(5).max(500).required(),
        articleContent: Joi.string().min(5).max(5000).required()
    })
    return validArticleRegisterSchema.validate(body);
}

exports.validateArticleCommentRegisteration = (body) => {
    const validArticleCommentRegisterSchema = Joi.object({
        commenterName: Joi.string().required().max(150).min(2),
        commenterEmail: Joi.string().required().min(5).max(150).required(),
        commentContent: Joi.string().required().min(5).max(500).required()
    })
    return validArticleCommentRegisterSchema.validate(body);
}