const mongoose = require('mongoose');

const projectsModel = new mongoose.Schema({

    projectTitle: {
        type: String,
        minLength: 2,
        maxLength: 150,
        required: true
    },
    projectDescription: {
        type: String,
        minLength: 5,
        required: true
    },
    projectContent: {
        type: String,
        minLength: 5,
        required: true
    },
    projectMainImage: {
        type: String,
        required: true
    },
    projectLinks: {
        type: Array,
        required: true
    }

}, { timestamps: true })

const Projects = mongoose.model('Project', projectsModel);

exports.Projects = Projects;