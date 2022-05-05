const { Router } = require('express');
const messageRouter = Router();
const { auth } = require('../middlewares/auth.middleware');

const { addMessage, getAllMessages, deleteMessage, answerMessage } =  require('../controllers/messages.controller');

/**
 * @description To create a new message
 * @api /api/v1/messages/
 * @access Public
 * @type POST
 */

messageRouter.post('/', addMessage);

/**
 * @description To answer to a message
 * @api /api/v1/messages/:id
 * @access Private
 * @type POST
 */

messageRouter.post('/:id', auth, answerMessage);

/**
 * @description To get all the messages asked
 * @api /api/v1/messages/
 * @access Private
 * @type GET
 */

messageRouter.get('/', auth, getAllMessages);

/**
 * @description To delete a message
 * @api /api/v1/messages/:id
 * @access Private
 * @type DELETE
 */

messageRouter.delete('/:id', auth, deleteMessage);

exports.messageRouter = messageRouter;