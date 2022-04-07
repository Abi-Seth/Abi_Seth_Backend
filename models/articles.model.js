const mongoose = require('mongoose');

const articlesModel = new mongoose.Schema({

    articleTitle: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 150,
        unique: false
    },
    articleDescription: {
        type: String,
        required: true,
        minLength: 5
    },
    articleContent: {
        type: String,
        required: true,
        minLength: 5
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