const { Router } = require('express');
const projectRouter = Router();
const { uploadFile } = require('../utils/fileUploader');
const file_upload = uploadFile("public/projects");
const { auth } = require('../middlewares/auth.middleware');

const { addProject, updateProject, getAllProjects, getProjectById, deleteProject } = require('../controllers/projects.controller');

/**
 * @description To create a new project
 * @api /api/projects/addProject
 * @access Private
 * @type POST
 */

projectRouter.post('/addProject', auth, file_upload.single('projectMainImage'), addProject);

/**
 * @description To update a project
 * @api /api/projects/updateProjects
 * @access Private
 * @type PUT
 */

projectRouter.put('/updateProject/:id', auth, updateProject);

/**
 * @description To get all projects
 * @api /api/projects/getAllProjects
 * @access Public
 * @type GET
 */

projectRouter.get('/getAllProjects', getAllProjects);

/**
 * @description To get single project
 * @api /api/projects/getProjectById/:id
 * @access Public
 * @type GET
 */

projectRouter.get('/getProjectById/:id', getProjectById);

/**
 * @description To delete an project
 * @api /api/projects/deleteProject/:id
 * @access Private
 * @type DELETE
 */

projectRouter.delete('/deleteProject/:id', auth, deleteProject);

exports.projectRouter = projectRouter;