const { Router } = require('express');
const articleRouter = Router();
const { uploadFile } = require('../utils/fileUploader');
const file_upload = uploadFile("public/articles");
const { auth } = require('../middlewares/auth.middleware');

const { addArticle, updateArticle, getAllArticles, getArticleById, deleteArticle, commentOnArticle, likeArticle, dislikeArticle } = require('../controllers/articles.controller');

/**
 * @description To create a new article
 * @api /api/articles/
 * @access Private
 * @type POST
 */

articleRouter.post('/', auth, file_upload.single('articleMainImage'), addArticle);

/**
 * @description To update an article
 * @api /api/articles/
 * @access Private
 * @type PUT
 */

articleRouter.put('/:id', auth, updateArticle);

/**
 * @description To get all articles
 * @api /api/articles/
 * @access Public
 * @type GET
 */

articleRouter.get('/', getAllArticles);

/**
 * @description To get single article
 * @api /api/articles/getArticleById/:id
 * @access Public
 * @type GET
 */

articleRouter.get('/:id', getArticleById);

/**
 * @description To delete an article
 * @api /api/articles/deleteArticle/:id
 * @access Private
 * @type DELETE
 */

articleRouter.delete('/:id', auth, deleteArticle);

/**
 * @description To comment on an article
 * @api /api/articles/:id/comment
 * @access Public
 * @type POST
 */

articleRouter.post('/:id/comment', commentOnArticle);

/**
 * @description To like an article
 * @api /api/articles/:id/like
 * @access Public
 * @type POST
 */

articleRouter.post('/:id/like', likeArticle);

/**
 * @description To dislike an article
 * @api /api/articles/:id/dislike
 * @access Public
 * @type POST
 */

articleRouter.post('/:id/dislike', dislikeArticle);

exports.articleRouter = articleRouter;