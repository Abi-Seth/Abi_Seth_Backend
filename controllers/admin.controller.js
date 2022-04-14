const _ = require('lodash');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { Admin } = require('../models/admin.model');
const { APP_DOMAIN } = require('../constants/index.constants');
const { validateAdminRegisteration, validateAdminAuthenatication, validateAdminUpdation } = require('../validators/admin.validator');

exports.addAdministrator = async (req, res) => {
    try {
        const admin = req.body;
        const validateAdminInput = validateAdminRegisteration(admin);

        if (validateAdminInput.error) {
            return res.status(400).send(validateAdminInput.error.details[0].message);
        }

        const duplicateUsername = await Admin.findOne({ username: admin.username });
        if (duplicateUsername) {
            return res.status(403).send({
                success: false,
                status: 403,
                message: 'Administrator with this username is already registered!'
            })
        }

        const duplicateEmail = await Admin.findOne({ email: admin.email });
        if (duplicateEmail) {
            return res.status(403).send({
                success: false,
                status: 403,
                message: 'Administrator with this email is already registered!'
            })
        }

        const newAdmin = new Admin(_.pick(admin, ['username', 'email', 'password']));
        
        const salt = await bcrypt.genSalt(10);
        newAdmin.password = await bcrypt.hash(newAdmin.password, salt);

        await newAdmin.save()
            .then(() => {

                res.status(201).send({
                    success: true,
                    status: 201,
                    message: 'Admin created successfully.',
                    data: newAdmin
                })

            }).catch((err) => {
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

exports.updateAdministrator = async (req, res) => {
    try {

        const adminId = req.params.adminId;
        let admin;
        
        admin = await Admin.findById(adminId);
        
        if (!admin) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'Admin not found!'               
            })
        }
        
        const duplicateUsername = await Admin.findOne({
            _id: {
                $ne: adminId
            },
            username: req.body.username
        })
        
        if (duplicateUsername) {
            return res.status(403).send({
                success: false,
                status: 403,
                message: 'Username already registered!'
            })
        }
        
        const duplicateEmail = await Admin.findOne({
            _id: {
                $ne: adminId
            },
            email: req.body.email
        })
        
        if (duplicateEmail) {
            return res.status(403).send({
                success: false,
                status: 403,
                message: 'Email address already registered!'
            })
        }
        
        try {
            
            const validateAdminInput = validateAdminUpdation(_.pick(req.body, ['username', 'email']));

            if (validateAdminInput.error) {
                return res.status(400).send(validateAdminInput.error.details[0].message);
            }

            let newpassword = '';

            if (req.body.password !== '') {
                const salt = await bcrypt.genSalt(10);
                newpassword = await bcrypt.hash(req.body.password, salt);
            } else {
                newpassword = admin.password;
            }

            let currentProfilePicture = req.file;
            let profilePicturePath;
            let imageInfo;

            //upload image
            if (!currentProfilePicture) {
                if (admin.profilePicture != `${APP_DOMAIN}public/admin/defaultAvatar.png`) {
                    profilePicturePath = admin.profilePicture;
                } else {
                    profilePicturePath = `${APP_DOMAIN}public/admin/defaultAvatar.png`;
                }

                imageInfo = {
                    "secure_url": profilePicturePath,
                }
            } else {

                if (admin.profilePicture != `${APP_DOMAIN}public/admin/defaultAvatar.png`) {

                    let file = admin.profilePicture;
                    let filenametodel = file.split('/')[6];
                    let deletefile = 'public/admin/'+filenametodel;
                                    
                    fs.unlink(deletefile, (err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
            
                    })

                }
                
                profilePicturePath = `${APP_DOMAIN}public/admin/${req.file.filename}`;

                imageInfo = {
                    "secure_url": profilePicturePath
                }
            }

            let updatedAdmin = await Admin.findOneAndUpdate({ _id: adminId }, {
                username: req.body.username,
                email: req.body.email,
                password: newpassword,
                profilePicture: imageInfo.secure_url
            }, { new: true })

            res.status(200).send({
                success: true,
                status: 200,
                message: 'Admin updated successfully',
                data: updatedAdmin
            }) 

        } catch(err) {
            res.status(400).send({
                success: false,
                status: 400,
                message: err.message
            })
        }

    } catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}

exports.getOneAdministrator = async (req, res) => {
    try {

        const admin = await Admin.findById({
            _id: req.params.adminId
        })

        if (!admin){
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Administrator not found!"
            })
        }

        var admin_data = {
            "createdAt": admin.createdAt,
            "email": admin.email,
            "profilePicture": admin.profilePicture,
            "updatedAt": admin.updatedAt,
            "username": admin.username,
            "__v": admin.__v,
            "_id": admin._id
        }

        return res.status(200).send({
            success: true,
            status: 200,
            message: "Administrator found.",
            data: admin_data
        })

    } catch (err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}

exports.authenaticateAdministrator = async (req, res) => {
    try {
        const validateAdminInput = validateAdminAuthenatication(_.pick(req.body, ['email', 'password']));

        if (validateAdminInput.error) {
            return res.status(400).send(validateAdminInput.error.details[0].message);
        }

        let admin = await Admin.findOne({ email: req.body.email });

        if (!admin) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'Incorrect email or password!'
            })
        }

        const validPassword = await bcrypt.compare( req.body.password, admin.password );

        if (!validPassword) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: 'Incorrect email or password!'
            })
        }

        const token = await admin.generateAuthToken();
        res.status(200).send({
            success: true,
            status: 200,
            message: 'You are logged in!',
            data: {
                token: token
            }
        })

    } catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}

exports.getAllAdministrators = async (req, res) => {
    try {
        const admins = await Admin.find().sort({_id: -1});

        res.status(200).send({
            success: true,
            status: 200,
            message: 'All administrators',
            data: admins
        })

    }catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}

exports.deleteAdministrator = async (req, res) => {
    try {
        const adminId = req.params.adminId;

        const admin = await Admin.findById(adminId)

        if (!admin) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'Admin not found!'
            })
        }

        await Admin.findByIdAndDelete(admin)
            .then(() => {
                res.status(200).send({
                    success: true,
                    status: 200,
                    message: 'Admin deleted successfully!'
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