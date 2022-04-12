const { Router } = require('express');
const articleRouter = Router();
const { uploadFile } = require('../utils/fileUploader');
const file_upload = uploadFile("public/articles");
const { auth } = require('../middlewares/auth.middleware');

const { addArticle, updateArticle, getAllArticles, getArticleById, deleteArticle, commentOnArticle, likeArticle, dislikeArticle } = require('../controllers/articles.controller');

/**
 * @description To create a new article
 * @api /api/articles/addArticle
 * @access Private
 * @type POST
 */

articleRouter.post('/addArticle', auth, file_upload.single('articleMainImage'), addArticle);

/**
 * @description To update an article
 * @api /api/articles/updateArticles
 * @access Private
 * @type PUT
 */

articleRouter.put('/updateArticle/:id', auth, updateArticle);

/**
 * @description To get all articles
 * @api /api/articles/getAllArticles
 * @access Public
 * @type GET
 */

articleRouter.get('/getAllArticles', getAllArticles);

/**
 * @description To get single article
 * @api /api/articles/getArticleById/:id
 * @access Public
 * @type GET
 */

articleRouter.get('/getArticleById/:id', getArticleById);

/**
 * @description To delete an article
 * @api /api/articles/deleteArticle/:id
 * @access Private
 * @type DELETE
 */

articleRouter.delete('/deleteArticle/:id', auth, deleteArticle);

/**
 * @description To comment on an article
 * @api /api/articles/commentOnArticle/:id
 * @access Public
 * @type POST
 */

articleRouter.post('/commentOnArticle/:id', commentOnArticle);

/**
 * @description To like an article
 * @api /api/articles/likeArticle/:id
 * @access Public
 * @type POST
 */

articleRouter.post('/likeArticle/:id', likeArticle);

/**
 * @description To dislike an article
 * @api /api/articles/dislikeArticle/:id
 * @access Public
 * @type POST
 */

articleRouter.post('/dislikeArticle/:id', dislikeArticle);

exports.articleRouter = articleRouter;