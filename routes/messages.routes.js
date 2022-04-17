const { Router } = require('express');
const messageRouter = Router();
const { auth } = require('../middlewares/auth.middleware');

const { addMessage, getAllMessages, deleteMessage, answerMessage } =  require('../controllers/messages.controller');

/**
 * @description To create a new message
 * @api /api/v1/messages/addMessage
 * @access Public
 * @type POST
 */

messageRouter.post('/addMessage', addMessage);

/**
 * @description To answer to a message
 * @api /api/v1/messages/answerMessage
 * @access Private
 * @type POST
 */

messageRouter.post('/answerMessage', auth, answerMessage);

/**
 * @description To get all the messages asked
 * @api /api/v1/messages/getAllMessages
 * @access Private
 * @type GET
 */

messageRouter.get('/getAllMessages', auth, getAllMessages);

/**
 * @description To delete a message
 * @api /api/v1/messages/deleteMessage/:id
 * @access Private
 * @type DELETE
 */

messageRouter.delete('/deleteMessage/:id', auth, deleteMessage);

exports.messageRouter = messageRouter;