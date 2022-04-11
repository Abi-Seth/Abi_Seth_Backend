const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { AUTH_SECRET, APP_DOMAIN } = require('../constants/index.constants');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 5
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    profilePicture: {
        type: String,
        default: `${APP_DOMAIN}public/admin/defaultAvatar.png`
    }
}, { timestamps: true });

adminSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
        profilePicture: this.profilePicture
    }, AUTH_SECRET, { expiresIn: '2d' })
    return token;
}

const Admin = mongoose.model('Admin', adminSchema);

exports.Admin = Admin;