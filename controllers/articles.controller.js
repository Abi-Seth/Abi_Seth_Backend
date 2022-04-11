const _ = require('lodash');
const fs = require('fs');
const { v4 } = require('uuid');
const { Articles } = require('../models/articles.model');
const { validateArticleRegisteration } = require('../validators/articles.validator');

exports.addArticle = async (req, res) => {

    try {
        const article = req.body;

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
        const articleId = req.params.id
        
        const article = await Articles.findById(articleId)

        if (!article) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'Article not found!'
            })
        }

        const duplicateArticleTitle = await Articles.findOne({
            _id: {
                $ne: articleId
            },
            articleTitle: req.body.articleTitle
        })

        if (duplicateArticleTitle) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: 'Article title already exists!'
            })
        }

        const validArticleInput = await validateArticleRegisteration(_.pick(req.body, ['articleTitle', 'articleDescription', 'articleContent', 'articleMainImage']));

        if (validArticleInput.error) {
            return res.send(validArticleInput.error.details[0].message);
        }

        await Articles.findOneAndUpdate({ _id: articleId }, req.body, { new: true })
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
        const articleId = req.params.id

        const article = await Articles.findById(articleId)

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