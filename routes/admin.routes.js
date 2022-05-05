const { Router } = require('express');
const adminRouter = Router();
const { uploadFile } = require('../utils/fileUploader');
const file_upload = uploadFile("public/admin");
const { auth } = require('../middlewares/auth.middleware');
const { addAdministrator, updateAdministrator, authenaticateAdministrator, getOneAdministrator, deleteAdministrator, getAllAdministrators } =  require('../controllers/admin.controller');

/**
 * @description To create a new admin
 * @api /api/admin/
 * @access Private
 * @type POST
 */

adminRouter.post('/', auth, addAdministrator);

/**
 * @description To update admin info
 * @api /api/admin/:adminId
 * @access Private
 * @type PUT
 */

adminRouter.put('/:adminId', auth, file_upload.single('profilePicture'), updateAdministrator);

/**
 * @description To get one admin's info
 * @api /api/admin/:adminId
 * @access Private
 * @type GET
 */

adminRouter.get('/:adminId', auth, getOneAdministrator);

/**
 * @description To delete one admin's info
 * @api /api/admin/:adminId
 * @access Private
 * @type DELETE
 */

adminRouter.delete('/:adminId', auth, deleteAdministrator);

/**
 * @description To get all admins' info
 * @api /api/admin/
 * @access Private
 * @type GET
 */

adminRouter.get('/', auth, getAllAdministrators);

/**
 * @description To login an admin
 * @api /api/admin/authenaticate
 * @access Public
 * @type POST
 */

adminRouter.post('/authenaticate', authenaticateAdministrator);

exports.adminRouter = adminRouter;