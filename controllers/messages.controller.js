const _ = require('lodash');
const { sendEmail } = require('../utils/sendEmails');

const { Messages } = require('../models/messages.model');
const { validateMessage, validateMessageAnswer } = require('../validators/messages.validator');
const { APP_FRONTEND_DOMAIN } = require('../constants/index.constants');

exports.addMessage = async (req, res) => {
    try {
        const message = req.body;

        const validMessage = await validateMessage(_.pick(message, ['messageNames', 'messageEmail', 'messageContent']));
        if (validMessage.error) {
            return res.status(400).send(validMessage.error.details[0].message);
        }

        const newMessage = await Messages(_.pick(message, ['messageNames', 'messageEmail', 'messageContent']));
        await newMessage.save()
            .then(() => {
                res.status(200).send({
                    success: true,
                    status: 200,
                    message: 'Message successfully sent!',
                    data: newMessage
                })

                const subject = "Abi-Seth: Feedback message awareness."
                const html = `
                    <p style="font-family: Poppins">Hello ${message.messageNames}</p>
                    <p style="font-family: Poppins">Abi Seth is thankful for you message and will reply soon if needed keep in touch. <br> Meanwhile just take a look to my new blogs by clicking the button below</p> 
                    <br>
                    <a style="padding: 0.9em 2em; background: #FF3834; font-family: Poppins !important; border-radius: 0.3em; color: white; font-size: 0.88em; text-decoration: none; margin: 2em 0;" target="_blank" href='${APP_FRONTEND_DOMAIN}blogs.html'>See our latest blogs</a>
                `;
                sendEmail(message.messageEmail, subject, html);
            })
            .catch((err) => {
                res.status(400).send({
                    success: false,
                    status: 400,
                    message: err.message
                })
            })

    }catch(err){
        res.send({
            success: false,
            status: 400,
            message: err.message
        }).status(400)
    }
}

exports.answerMessage = async (req, res) => {
    try {
        const answer = req.body;

        const validAnswer = await validateMessageAnswer(_.pick(answer, ['answerId', 'messageNames', 'messageHeading', 'messageEmail', 'messageContent']));
        if (validAnswer.error) {
            return res.status(400).send(validAnswer.error.details[0].message);
        }

        const message = await Messages.findById(answer.answerId);

        if (!message) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'This message is not found!'
            })
        }
        
        const email = await Messages.findOne({ messageEmail: answer.messageEmail });
        
        if (!email) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'This email is not found!'
            })
        }

        if (message.MessageAnswered == 'yes') {
            return res.status(400).send({
                success: false,
                status: 400,
                message: 'This message is already answered!'
            })
        }

        const subject = `Abi-Seth: Reply to you message some hours back.` 
        const html = `
            <p style="font-family: Poppins">Hello ${answer.messageNames},</p>
            <p style="font-family: Poppins"></p>Abi Seth is again thanking you for you message and now here is you reply.</p> 
            <br>
            <h2 style="font-family: Poppins">${answer.messageHeading}</h2>
            <p style="font-family: Poppins">${answer.messageContent}</p>
        `;
        sendEmail(answer.messageEmail, subject, html);

        message.messageAnswered = 'yes';

        await message.save();

        res.status(200).send({
            success: true,
            status: 200,
            message: 'Message answered successfully'
        })

    } catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}

exports.deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id

        const message = await Messages.findById(messageId)

        if (!message) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'This message is not found!'
            })
        }

        await Messages.findByIdAndDelete(message)
            .then(() => {
                res.status(200).send({
                    success: true,
                    status: 200,
                    message: 'Message deleted successfully!'
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

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Messages.find().sort({_id: -1});

        res.status(200).send({
            success: true,
            status: 200,
            message: 'All messages',
            data: messages
        })

    }catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}