const chai = require('chai');
const chaiHttp = require('chai-http');
const server = 'http://localhost:5400/';

chai.should();
chai.use(chaiHttp);

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjU4MGU4YmMyZDM5OGExOTBjMjU4N2UiLCJ1c2VybmFtZSI6ImFiaXNldGgiLCJlbWFpbCI6ImFiaWhlbG9hZkBnbWFpbC5jb20iLCJwcm9maWxlUGljdHVyZSI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9wdWJsaWMvYWRtaW4vZGVmYXVsdEF2YXRhci5wbmciLCJpYXQiOjE2NTAyMTM3MTUsImV4cCI6MTY1MDM4NjUxNX0.uavBEz9YKlXjYtukA3JQh8zUQ2f8T2cVwZR9s01vUL4';

describe('POST /api/v1/messages/addMessage', () => {

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
            .post("api/v1/messages/addMessage")
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

describe('GET /api/v1/messages/getAllMessages', () => {

    /**
     * Should GET all messages
     */

    it('It should GET all messages', (done) => {

        chai.request(server)
            .get("api/v1/messages/getAllMessages")
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
            .get("api/v1/messages/getMessages")
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

describe('DELETE /api/v1/messages/deleteMessage/:id', () => {

    /**
     * Should DELETE one message (by id)
     */

    it('It should DELETE one message (by id)', (done) => {
        const messageId = '625c43c5559ce86eba7e76f0';

        chai.request(server)
            .delete(`api/v1/messages/deleteMessage/${messageId}`)
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
            .delete(`api/v1/messages/deleteMessage/${messageId}`)
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

describe('POST /api/v1/messages/answerMessage', () => {

    /**
     * Should POST a reply to a message
     */

    it('It should POST a reply to a message', (done) => {
        const replyRad = Math.floor(Math.random()*1000);

        const newReply = {
            answerId: `625c43836f50d96f95980149`,
            messageNames: `Messenger ${replyRad}`,
            messageHeading: `Message heading ${replyRad}`,
            messageEmail: `abiheloaf@gmail.com`,
            messageContent: `Message reply content ${replyRad}`
        }

        chai.request(server)
            .post(`api/v1/messages/answerMessage`)
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

        const newReply = {
            answerId: `aaaa7f6fbda81e2fc42ef080`,
            messageNames: `Messenger ${replyRad}`,
            messageHeading: `Message heading ${replyRad}`,
            messageEmail: `abiheloaf@gmail.com`,
            messageContent: `Message reply content ${replyRad}`
        }

        chai.request(server)
            .post(`api/v1/messages/answerMessage`)
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
     * Should NOT POST a reply on a message email that does not exit
     */

    it('It should NOT POST a reply on a message email that does not exit', (done) => {
        const replyRad = Math.floor(Math.random()*1000);

        const newReply = {
            answerId: `625c43836f50d96f95980149`,
            messageNames: `Messenger ${replyRad}`,
            messageHeading: `Message heading ${replyRad}`,
            messageEmail: `abihegeeeeweee@gmail.com`,
            messageContent: `Message reply content ${replyRad}`
        }

        chai.request(server)
            .post(`api/v1/messages/answerMessage`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(newReply)
            .end((err, response) => {
                response.should.have.status(404);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("This email is not found!");  
                done();
            })
    })

    /**
     * Should NOT POST a reply on a message that is already answered
     */

    it('It should NOT POST a reply on a message that is already answered', (done) => {
        const replyRad = Math.floor(Math.random()*1000);

        const newReply = {
            answerId: `625c43836f50d96f95980149`,
            messageNames: `Messenger ${replyRad}`,
            messageHeading: `Message heading ${replyRad}`,
            messageEmail: `abiheloaf@gmail.com`,
            messageContent: `Message reply content ${replyRad}`
        }

        chai.request(server)
            .post(`api/v1/messages/answerMessage`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(newReply)
            .end((err, response) => {
                response.should.have.status(400);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("This message is already answered!");  
                done();
            })
    })

})
