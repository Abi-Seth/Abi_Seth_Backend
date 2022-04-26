const mongoose = require('mongoose');

const messagesModel = new mongoose.Schema({

    messageNames: { 
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    messageEmail: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    messageContent: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 500
    },
    messageAnswered: {
        type: String,
        enum: ['yes', 'no'],
        minLength: 2,
        maxLength: 3,
        default: 'no'
    }

}, { timestamps: true })

const Messages = mongoose.model('Message', messagesModel);

exports.Messages = Messages;