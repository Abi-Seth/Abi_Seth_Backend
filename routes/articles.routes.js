const { Router } = require('express');
const articleRouter = Router();

const { auth } = require('../middlewares/auth.middleware');

const { addArticle, updateArticle, getAllArticles, getArticleById, deleteArticle } = require('../controllers/articles.controller');

/**
 * @description To create a new article
 * @api /api/articles/addArticle
 * @access Private
 * @type POST
 */

articleRouter.post('/addArticle', auth, addArticle);

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

exports.articleRouter = articleRouter;