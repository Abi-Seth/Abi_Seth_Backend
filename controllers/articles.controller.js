const _ = require('lodash');
const fs = require('fs');
const { v4 } = require('uuid');
const { Articles } = require('../models/articles.model');
const { APP_DOMAIN } = require('../constants/index.constants')
;const { validateArticleRegisteration, validateArticleCommentRegisteration } = require('../validators/articles.validator');

exports.addArticle = async (req, res) => {

    try {
        const article = req.body;

        const duplicateArticleTitle = await Articles.findOne({ articleTitle: req.body.articleTitle })

        if (duplicateArticleTitle) {
            return res.status(403).send({
                success: false,
                status: 403,
                message: 'Article title already exists!'
            })
        }

        if (req.file != undefined)
            article.articleMainImage = `${APP_DOMAIN}public/articles/${req.file.filename}`;

        const validArticleInput = await validateArticleRegisteration(_.pick(article, ['articleTitle', 'articleDescription', 'articleContent', 'articleMainImage']));

        if (validArticleInput.error) {
            return res.send(validArticleInput.error.details[0].message);
        }

        const newArticle = new Articles(article);

        await newArticle.save();
        res.status(201).send({
            success: true,
            status: 201,
            message: 'Article created successfully.',
            data: article
        })

    } catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message,
        })
    }
    
}

exports.updateArticle = async (req, res) => {

    try {
        const articleId = req.params.id;
        
        const article = await Articles.findById(articleId);
        
        if (!article) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'Article not found!'
            })
        }

        let updatedArticle = article;

        const duplicateArticleTitle = await Articles.findOne({
            _id: {
                $ne: articleId
            },
            articleTitle: updatedArticle.articleTitle
        })

        if (duplicateArticleTitle) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: 'Article title already exists!'
            })
        }

        if (req.file != undefined)
            updatedArticle.articleMainImage = `${APP_DOMAIN}public/articles/${req.file.filename}`;

        const validArticleInput = await validateArticleRegisteration(_.pick(updatedArticle, ['articleTitle', 'articleDescription', 'articleContent', 'articleMainImage']));

        if (validArticleInput.error) {
            return res.send(validArticleInput.error.details[0].message);
        }

        await Articles.findOneAndUpdate({ _id: articleId }, updatedArticle, { new: true })
            .then(() => {
                res.status(200).send({
                    success: true,
                    status: 200,
                    message: 'Article updated successfully!'
                })
            })
            .catch((err) => {
                res.status(400).send({
                    success: false,
                    status: 400,
                    message: err.message
                })
            })

    }catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Articles.find().sort({_id: -1});

        res.status(200).send({
            success: true,
            status: 200,
            message: 'All my articles',
            data: articles
        })

    }catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}

exports.getArticleById = async (req, res) => {
    try {
        const articleId = req.params.id

        const article = await Articles.findById(articleId)

        if (!article) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'Article not found!'
            })
        }

        res.status(200).send({
            success: true,
            status: 200,
            data: article
        })


    } catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}

exports.deleteArticle = async (req, res) => {
    try {
        const articleId = req.params.id;

        const article = await Articles.findById(articleId);

        if (!article) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'Article not found!'
            })
        }

        await Articles.findByIdAndDelete(article)
            .then(() => {
                res.status(200).send({
                    success: true,
                    status: 200,
                    message: 'Article deleted successfully!'
                })
            })
            .catch((err) => {
                res.status(400).send({
                    success: false,
                    status: 400,
                    message: err.message
                })
            })

    } catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}

exports.commentOnArticle = async (req, res) => {
    try {
        const articleId = req.params.id;
        const comment = req.body;

        const article = await Articles.findById(articleId)

        if (!article) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'Article not found!'
            })
        }

        const validCommentInput = await validateArticleCommentRegisteration(_.pick(req.body, ['commenterName', 'commenterEmail', 'commentContent']));

        if (validCommentInput.error) {
            return res.send(validCommentInput.error.details[0].message);
        }

        let newComment = {
            commentId: v4(),
            commenterName: comment.commenterName,
            commenterEmail: comment.commenterEmail,
            commentContent: comment.commentContent,
        }

        article.articleComments = [...article.articleComments, newComment];

        await article.save()
            .then(() => {
                res.status(200).send({
                    success: true,
                    status: 200,
                    message: 'Commented article successfully!'
                })
            })
            .catch((err) => {
                res.status(400).send({
                    success: false,
                    status: 400,
                    message: err.message
                })
            })

    } catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}

exports.likeArticle = async (req, res) => {
    try {
        const articleId = req.params.id

        const article = await Articles.findById(articleId)

        if (!article) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'Article not found!'
            })
        }

        article.articleLikes = article.articleLikes+1;

        await article.save()
            .then(() => {
                res.status(200).send({
                    success: true,
                    status: 200,
                    message: 'Article liked successfully!'
                })
            })
            .catch((err) => {
                res.status(400).send({
                    success: false,
                    status: 400,
                    message: err.message
                })
            })

    } catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}

exports.dislikeArticle = async (req, res) => {
    try {
        const articleId = req.params.id

        const article = await Articles.findById(articleId)

        if (!article) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'Article not found!'
            })
        }

        if (article.articleLikes == 0) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: 'This article has 0 likes!'
            })
        }

        article.articleLikes = article.articleLikes-1;

        await article.save()
            .then(() => {
                res.status(200).send({
                    success: true,
                    status: 200,
                    message: 'Article unliked successfully!'
                })
            })
            .catch((err) => {
                res.status(400).send({
                    success: false,
                    status: 400,
                    message: err.message
                })
            })

    } catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}