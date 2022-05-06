const chai = require('chai');
const chaiHttp = require('chai-http');
const { APP_AUTH_TOKEN, APP_DOMAIN } = require('../constants/index.constants');
const server = APP_DOMAIN;

chai.should();
chai.use(chaiHttp);

const token = APP_AUTH_TOKEN;

describe('POST /api/v1/messages/', () => {

    /**
     * Should POST a new message
     */

    it('It should POST a new message', (done) => {
        const messageRad = Math.floor(Math.random()*1000);
        const newMessage = {
            messageNames: `Messenger ${messageRad}`,
            messageEmail: `messenger${messageRad}@gmail.com`,
            messageContent: `New message content ${messageRad}`
        }
        chai.request(server)
            .post("api/v1/messages/")
            .send(newMessage)
            .end((err, response) => {
                response.should.have.status(201);
                response.body.should.be.a('object');
                response.body.should.have.property('data');
                response.body.should.have.property('status').eq(201);
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Message successfully sent!");
                done();
            })
    })
});

describe('GET /api/v1/messages/', () => {

    /**
     * Should GET all messages
     */

    it('It should GET all messages', (done) => {

        chai.request(server)
            .get("api/v1/messages/")
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("All messages");
                response.body.should.have.property('data').be.a('array');    
                done();
            })
    })

    /**
     * Should NOT GET all messages
     */

    it('It should NOT GET all messages', (done) => {
        chai.request(server)
            .get("api/v1/messages/getAllMessages")
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
})

describe('DELETE /api/v1/messages/:id', () => {

    /**
     * Should DELETE one message (by id)
     */

    it('It should DELETE one message (by id)', (done) => {
        const messageId = '62756e55ec54a5a657d4ba0b';

        chai.request(server)
            .delete(`api/v1/messages/${messageId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Message deleted successfully!");
                done();
            })
    })

    /**
     * Should NOT DELETE a message that does not exist
     */

    it('It should NOT DELETE a message that does not exist', (done) => {
        const messageId = '625c43c5559ce86eba7e76f0';
        chai.request(server)
            .delete(`api/v1/messages/${messageId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .end((err, response) => {
                response.should.have.status(404);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("This message is not found!");    
                done();
            })
    })

})

describe('POST /api/v1/messages/:id', () => {

    /**
     * Should POST a reply to a message
     */

    it('It should POST a reply to a message', (done) => {
        const replyRad = Math.floor(Math.random()*1000);
        const messageId = '62757078ec54a5a657d4ba4d';

        const newReply = {
            messageHeading: `Message heading ${replyRad}`,
            messageContent: `Message reply content ${replyRad}`
        }

        chai.request(server)
            .post(`api/v1/messages/${messageId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(newReply)
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Message answered successfully");  
                done();
            })
    })

    /**
     * Should NOT POST a reply on a message that does not exit
     */

    it('It should NOT POST a reply on a message that does not exit', (done) => {
        const replyRad = Math.floor(Math.random()*1000);
        const messageId = '625c43caaa9aaaaeba7e76f0';

        const newReply = {
            messageHeading: `Message heading ${replyRad}`,
            messageContent: `Message reply content ${replyRad}`
        }

        chai.request(server)
            .post(`api/v1/messages/${messageId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(newReply)
            .end((err, response) => {
                response.should.have.status(404);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("This message is not found!");  
                done();
            })
    })

    /**
     * Should NOT POST a reply on a message that is already answered
     */

    it('It should NOT POST a reply on a message that is already answered', (done) => {
        const replyRad = Math.floor(Math.random()*1000);
        const messageId = `625c43836f50d96f95980149`;

        const newReply = {
            messageHeading: `Message heading ${replyRad}`,
            messageContent: `Message reply content ${replyRad}`
        }

        chai.request(server)
            .post(`api/v1/messages/${messageId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(newReply)
            .end((err, response) => {
                response.should.have.status(403);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("This message is already answered!");  
                done();
            })
    })

})
