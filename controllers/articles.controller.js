const _ = 'lodash';
const fs = ('fs');
const { v4 } = require('uuid');
const { Articles } = require('../models/articles.model');
const { validateArticleRegisteration } = require('../validators/articles.validator');

exports.addArticle = async (req, res) => {

    try {
        const article = req.body;

        const validArticleInput = await validateArticleRegisteration(article);

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
