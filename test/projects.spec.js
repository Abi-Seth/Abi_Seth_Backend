const chai = require('chai');
const chaiHttp = require('chai-http');
const { APP_AUTH_TOKEN, APP_DOMAIN } = require('../constants/index.constants');
const server = APP_DOMAIN;

chai.should();
chai.use(chaiHttp);

const token = APP_AUTH_TOKEN;

describe('POST /api/v1/projects/addProject', () => {

    /**
     * Should POST a new project
     */

    it('It should POST a new project', (done) => {
        const projectRad = Math.floor(Math.random()*1000);
        const newProject = {
            projectTitle: `Project ${projectRad}`,
            projectDescription: `New project description ${projectRad}`,
            projectContent: `New project content ${projectRad}`,
            projectMainImage: `http://localhost:5400/public/public/projects${projectRad}image.png`,
            projectLinks: ['github', 'facebook', 'website']
        }
        chai.request(server)
            .post("api/v1/projects/addProject")
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(newProject)
            .end((err, response) => {
                response.should.have.status(201);
                response.body.should.be.a('object');
                response.body.should.have.property('data');
                response.body.should.have.property('status').eq(201);
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Project created successfully.");
                done();
            })
    })
});

describe('GET /api/v1/projects/getAllProjects', () => {

    /**
     * Should GET all projects
     */

    it('It should GET all projects', (done) => {

        chai.request(server)
            .get("api/v1/projects/getAllProjects")
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("All my projects");
                response.body.should.have.property('data').be.a('array');    
                done();
            })
    })

    /**
     * Should NOT GET all projects
     */

    it('It should NOT GET all projects', (done) => {
        chai.request(server)
            .get("api/v1/projects/getProjects")
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Welcome to Abi-Seth personal portfolio.");
                done();
            })
    })
})

describe('DELETE /api/v1/projects/deleteProject/:id', () => {

    /**
     * Should DELETE one project (by id)
     */

    it('It should DELETE one project (by id)', (done) => {
        const projectId = '626a85dd6f46b38684048300';

        chai.request(server)
            .delete(`api/v1/projects/deleteProject/${projectId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Project deleted successfully!");
                done();
            })
    })

    /**
     * Should NOT DELETE a project that does not exist
     */

    it('It should NOT DELETE a project that does not exist', (done) => {
        const projectId = '625c43c5559ce86eba7e76f0';
        chai.request(server)
            .delete(`api/v1/projects/deleteProject/${projectId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .end((err, response) => {
                response.should.have.status(404);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Project not found!");    
                done();
            })
    })

})

describe('PUT /api/v1/projects/updateProject/:id', () => {

    /**
     * Should UPDATE a project
     */

    it('It should UPDATE a project', (done) => {
        const projectRad = Math.floor(Math.random()*1000);
        const projectId = '6256e28de200694ace596f3c';
        const updatedProject = {
            projectTitle: `Project ${projectRad}`,
            projectDescription: `New project description ${projectRad}`,
            projectContent: `New project content ${projectRad}`,
            projectMainImage: `http://localhost:5400/public/public/projects${projectRad}image.png`,
            projectLinks: ['github', 'facebook', 'website']
        }
        chai.request(server)
            .put(`api/v1/projects/updateProject/${projectId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(updatedProject)
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Project updated successfully!");  
                done();
            })
    })

    /**
     * Should NOT UPDATE to a duplicate project
     */

    it('It should NOT UPDATE a project duplicate project titles', (done) => {
        const projectRad = Math.floor(Math.random()*1000);
        const projectId = '6256e28de200694ace596f3c';
        const updatedProject = {
            projectTitle: `Bookinga`,
            projectDescription: `New project description ${projectRad}`,
            projectContent: `New project content ${projectRad}`,
            projectMainImage: `http://localhost:5400/public/public/projects${projectRad}image.png`,
            projectLinks: ['github', 'facebook', 'website']
        }
        chai.request(server)
            .put(`api/v1/projects/updateProject/${projectId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(updatedProject)
            .end((err, response) => {
                response.should.have.status(400);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq(400);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Project title already exists!");
                done();
            })
    })

    /**
     * Should NOT UPDATE when a project does not exist
     */

    it('It should NOT UPDATE when a project does not exist', (done) => {
        const projectRad = Math.floor(Math.random()*1000);
        const projectId = '625af557805cd6a36711a736';
        const updatedProject = {
            projectTitle: `Project ${projectRad}`,
            projectDescription: `New project description ${projectRad}`,
            projectContent: `New project content ${projectRad}`,
            projectMainImage: `http://localhost:5400/public/public/projects${projectRad}image.png`,
            projectLinks: ['github', 'facebook', 'website']
        }
        chai.request(server)
            .put(`api/v1/projects/updateProject/${projectId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(updatedProject)
            .end((err, response) => {
                response.should.have.status(404);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq(404);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Project not found!");
                done();
            })
    })

})

describe('GET /api/v1/projects/getProjectById/:id', () => {

    /**
     * Should GET one project (by id)
     */

    it('It should GET one project (by id)', (done) => {
        const projectId = '6256e28de200694ace596f3c';

        chai.request(server)
            .get(`api/v1/projects/getProjectById/${projectId}`)
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('status').eq(200);
                response.body.should.have.property('data').be.a('object');    
                done();
            })
    })

    /**
     * Should NOT GET a project that does not exist
     */

    it('It should NOT GET a project that does not exist', (done) => {
        const projectId = 'aaa83d7762c3e740d629eaaa';
        chai.request(server)
            .get(`api/v1/projects/getProjectById/${projectId}`)
            .end((err, response) => {
                response.should.have.status(404);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Project not found!");    
                done();
            })
    })

})
