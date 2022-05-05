const _ = require('lodash');
const fs = require('fs');
const { v4 } = require('uuid');
const { Projects } = require('../models/projects.model');
const { APP_DOMAIN } = require('../constants/index.constants');
const { validateProjectRegisteration } = require('../validators/projects.validator');

exports.addProject = async (req, res) => {

    try {
        const project = req.body;

        if (req.file != undefined)
            project.projectMainImage = `${APP_DOMAIN}public/projects/${req.file.filename}`;
        
        const validProjectInput = await validateProjectRegisteration(_.pick(project, ['projectTitle', 'projectDescription', 'projectContent', 'projectLinks', 'projectMainImage']));

        if (validProjectInput.error) {
            return res.send(validProjectInput.error.details[0].message);
        }

        const newProject = new Projects(project);

        await newProject.save();
        res.status(201).send({
            success: true,
            status: 201,
            message: 'Project created successfully.',
            data: project
        })

    } catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message,
        })
    }
    
}

exports.updateProject = async (req, res) => {

    try {
        const projectId = req.params.id
        
        const project = await Projects.findById(projectId)

        if (!project) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'Project not found!'
            })
        }

        const duplicateProjectTitle = await Projects.findOne({
            _id: {
                $ne: projectId
            },
            projectTitle: req.body.projectTitle
        })

        if (duplicateProjectTitle) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: 'Project title already exists!'
            })
        }

        const validProjectInput = await validateProjectRegisteration(_.pick(req.body, ['projectTitle', 'projectDescription', 'projectContent', 'projectLinks', 'projectMainImage']));

        if (validProjectInput.error) {
            return res.send(validProjectInput.error.details[0].message);
        }

        await Projects.findOneAndUpdate({ _id: projectId }, req.body, { new: true })
            .then(() => {
                res.status(200).send({
                    success: true,
                    status: 200,
                    message: 'Project updated successfully!'
                })
            })
            .catch((err) => {
                res.status(400).send({
                    success: false,
                    status: 400,
                    message: err.message
                })
            })

    }catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Projects.find().sort({_id: -1});

        res.status(200).send({
            success: true,
            status: 200,
            message: 'All my projects',
            data: projects
        })

    }catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}

exports.getProjectById = async (req, res) => {
    try {
        const projectId = req.params.id

        const project = await Projects.findById(projectId)

        if (!project) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'Project not found!'
            })
        }

        res.status(200).send({
            success: true,
            status: 200,
            data: project
        })


    } catch(err) {
        res.status(400).send({
            success: false,
            status: 400,
            message: err.message
        })
    }
}

exports.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id

        const project = await Projects.findById(projectId)

        if (!project) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: 'Project not found!'
            })
        }

        await Projects.findByIdAndDelete(project)
            .then(() => {
                res.status(200).send({
                    success: true,
                    status: 200,
                    message: 'Project deleted successfully!'
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