const { Router } = require('express');

const adminRouter = Router();
const { auth } = require('../middlewares/auth.middleware');
const { addAdministrator, updateAdministrator, authenaticateAdministrator, getOneAdministrator, deleteAdministrator, getAllAdministrators } =  require('../controllers/admin.controller');

/**
 * @description To create a new admin
 * @api /api/admin/addAdmin
 * @access Private
 * @type POST
 */

adminRouter.post('/addAdmin', auth, addAdministrator);

/**
 * @description To update admin info
 * @api /api/admin/updateAdmin/:adminId
 * @access Private
 * @type PUT
 */

adminRouter.put('/updateAdmin/:adminId', auth, updateAdministrator);

/**
 * @description To get one admin's info
 * @api /api/admin/getOneAdmin/:adminId
 * @access Private
 * @type GET
 */

adminRouter.get('/getOneAdmin/:adminId', auth, getOneAdministrator);

/**
 * @description To delete one admin's info
 * @api /api/admin/deleteAdmin/:adminId
 * @access Private
 * @type DELETE
 */

adminRouter.delete('/deleteAdmin/:adminId', auth, deleteAdministrator);

/**
 * @description To get all admins' info
 * @api /api/admin/getAllAdmins
 * @access Private
 * @type GET
 */

adminRouter.get('/getAllAdmins', auth, getAllAdministrators);

/**
 * @description To login an admin
 * @api /api/admin/authenaticate
 * @access Public
 * @type POST
 */

adminRouter.post('/authenaticate', authenaticateAdministrator);

exports.adminRouter = adminRouter;