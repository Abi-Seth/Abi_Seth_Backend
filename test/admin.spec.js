const chai = require('chai');
const chaiHttp = require('chai-http');
const { APP_AUTH_TOKEN, APP_DOMAIN } = require('../constants/index.constants');
const server = APP_DOMAIN;

chai.should();
chai.use(chaiHttp);

const token = APP_AUTH_TOKEN;

describe('GET /api/v1/admin/getAllAdmins', () => {

    /**
     * Should GET all the administrators
     */

    it('It should GET all the administrators', (done) => {
        chai.request(server)
            .get("api/v1/admin/getAllAdmins")
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('data');
                response.body.should.have.property('data').be.a('array');
                response.body.should.have.property('status').eq(200);
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("All administrators");
                done();
            })
    })

    /**
     * Should NOT GET a new administrator
     */

    it('It should NOT GET all the administrators', (done) => {
        chai.request(server)
            .get("api/v1/admin/getAdmins")
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Welcome to Abi-Seth personal portfolio.");
                done();
            })
    })

});

describe('POST /api/v1/admin/addAdmin', () => {

    /**
     * Should POST a new administrator
     */

    it('It should POST a new administrator', (done) => {
        const userId = Math.floor(Math.random()*1000);
        const newAdmin = {
            "username": `abiseth${userId}`,
            "email": `abiheloaf${userId}@gmail.com`,
            "password": "admin12345"
        }

        chai.request(server)
            .post("api/v1/admin/addAdmin")
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(newAdmin)
            .end((err, response) => {
                response.should.have.status(201);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Admin created successfully.");
                response.body.should.have.property('data').be.a('object');    
                done();
            })
    })

    /**
     * Should NOT POST a duplicate administrator
     */

    it('It should NOT POST a duplicate administrator', (done) => {
        const newAdmin = {
            "username": "abiseth",
            "email": "abiheloaf@gmail.com",
            "password": "admin12345"
        }

        chai.request(server)
            .post("api/v1/admin/addAdmin")
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(newAdmin)
            .end((err, response) => {
                response.should.have.status(403);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Administrator with this username is already registered!");    
                done();
            })
    })

})

describe('PUT /api/v1/admin/updateAdmin/:id', () => {

    /**
     * Should UPDATE an administrator
     */

    it('It should UPDATE an administrator', (done) => {
        const userId = Math.floor(Math.random()*1000);
        const adminId = '62583d7762c3e740d629e214';

        const updateAdmin = {
            "username": `abi${userId}`,
            "email": `abi${userId}@gmail.com`,
            "password": "newadmin12345"
        }

        chai.request(server)
            .put(`api/v1/admin/updateAdmin/${adminId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(updateAdmin)
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Admin updated successfully");
                response.body.should.have.property('data').be.a('object');    
                done();
            })
    })

    /**
     * Should NOT UPDATE to a duplicate administrator
     */

    it('It should NOT UPDATE when administrator does not exit', (done) => {
        const userId = Math.floor(Math.random()*1000);
        const adminId = '62583d7762c3e7aaaaaaea14';

        const updateAdmin = {
            "username": `abi${userId}`,
            "email": `abi${userId}@gmail.com`,
            "password": "newadmin12345"
        }

        chai.request(server)
            .put(`api/v1/admin/updateAdmin/${adminId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(updateAdmin)
            .end((err, response) => {
                response.should.have.status(404);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Admin not found!");    
                done();
            })
    })

    /**
     * Should NOT UPDATE to a duplicate administrator
     */

    it('It should NOT UPDATE to existing administrator data', (done) => {
        const adminId = '62583d7762c3e740d629e214';

        const updateAdmin = {
            "username": "abiseth",
            "email": "abiheloaf@gmail.com",
            "password": "admin12345"
        }

        chai.request(server)
            .put(`api/v1/admin/updateAdmin/${adminId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(updateAdmin)
            .end((err, response) => {
                response.should.have.status(403);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Username already registered!");    
                done();
            })
    })

})

describe('GET /api/v1/admin/getOneAdmin/:adminId', () => {

    /**
     * Should GET one administrator (by id)
     */

    it('It should GET one administrator (by id)', (done) => {
        const adminId = '62583d7762c3e740d629e214';

        chai.request(server)
            .get(`api/v1/admin/getOneAdmin/${adminId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Administrator found.");
                done();
            })
    })

    /**
     * Should NOT GET an administrator who does not exist
     */

    it('It should NOT GET an administrator who does not exist', (done) => {
        const adminId = 'aaa83d7762c3e740d629eaaa';
        chai.request(server)
            .get(`api/v1/admin/getOneAdmin/${adminId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .end((err, response) => {
                response.should.have.status(404);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Administrator not found!");    
                done();
            })
    })

})

describe('POST /api/v1/admin/authenaticate', () => {

    /**
     * Should AUTHENATICATE an administrator
     */

    it('It should AUTHENATICATE an administrator', (done) => {
        const adminData = {
            "email": "abiheloaf@gmail.com",
            "password": "admin12345"
        };

        chai.request(server)
            .post(`api/v1/admin/authenaticate`)
            .send(adminData)
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("You are logged in!");
                response.body.should.have.property('data');
                response.body.data.should.have.property('token');
                done();
            })
    })

    /**
     * Should NOT AUTHENATICATE an administrator when they have incorrect email
     */

    it('It should NOT AUTHENATICATE an administrator when they have incorrect email', (done) => {
        const adminData = {
            "email": "abiheloaf123534notexit@gmail.com",
            "password": "admin12345"
        };

        chai.request(server)
            .post(`api/v1/admin/authenaticate`)
            .send(adminData)
            .end((err, response) => {
                response.should.have.status(404);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Incorrect email or password!");
                done();
            })
    })

    /**
     * Should NOT AUTHENATICATE an administrator when they have incorrect password
     */

    it('It should NOT AUTHENATICATE an administrator when they have incorrect password', (done) => {
        const adminData = {
            "email": "abiheloaf@gmail.com",
            "password": "asdsdmin12345"
        };

        chai.request(server)
            .post(`api/v1/admin/authenaticate`)
            .send(adminData)
            .end((err, response) => {
                response.should.have.status(400);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Incorrect email or password!");
                done();
            })
    })

})


describe('DELETE /api/v1/admin/deleteAdmin/:adminId', () => {

    /**
     * Should DELETE one administrator (by id)
     */

    it('It should DELETE one administrator (by id)', (done) => {
        const adminId = '626a8d1c4d512ba8cb16f702';

        chai.request(server)
            .delete(`api/v1/admin/deleteAdmin/${adminId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Admin deleted successfully!");
                done();
            })
    })

    /**
     * Should NOT DELETE an administrator who does not exist
     */

    it('It should NOT DELETE an administrator who does not exist', (done) => {
        const adminId = 'aaa83d7762c3e740d629eaaa';
        chai.request(server)
            .delete(`api/v1/admin/deleteAdmin/${adminId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .end((err, response) => {
                response.should.have.status(404);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Admin not found!");    
                done();
            })
    })

})
