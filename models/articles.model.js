const mongoose = require('mongoose');

const articlesModel = new mongoose.Schema({

    articleTitle: {
        type: String,
        minLength: 2,
        maxLength: 150,
        required: true
    },
    articleDescription: {
        type: String,
        minLength: 5,
        required: true
    },
    articleContent: {
        type: String,
        minLength: 5,
        required: true
    },
    articleMainImage: {
        type: String,
        required: true
    },
    articleLikes: {
        type: Number,
        default: 0
    },
    articleComments: {
        type: Array
    }

}, { timestamps: true })

const Articles = mongoose.model('Article', articlesModel);

exports.Articles = Articles;