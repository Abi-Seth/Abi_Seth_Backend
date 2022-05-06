const chai = require('chai');
const chaiHttp = require('chai-http');
const { APP_AUTH_TOKEN, APP_DOMAIN } = require('../constants/index.constants');
const server = APP_DOMAIN;

chai.should();
chai.use(chaiHttp);

const token = APP_AUTH_TOKEN;

describe('POST /api/v1/articles/', () => {

    /**
     * Should POST a new article
     */

    it('It should POST a new article', (done) => {
        const articleRad = Math.floor(Math.random()*1000);
        const newArticle = {
            articleTitle: `New article ${articleRad}`,
            articleDescription: `New article description ${articleRad}`,
            articleContent: `New article content ${articleRad}`,
            articleMainImage: `${APP_DOMAIN}public/public/article${articleRad}image.png` 
        }
        chai.request(server)
            .post("api/v1/articles/")
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(newArticle)
            .end((err, response) => {
                response.should.have.status(201);
                response.body.should.be.a('object');
                response.body.should.have.property('data');
                response.body.should.have.property('status').eq(201);
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Article created successfully.");
                done();
            })
    })

    /**
     * Should NOT POST an article duplicate article titles
     */

    it('It should NOT POST an article duplicate article titles', (done) => {
        const newArticle = {
            articleTitle: "New article 78",
            articleDescription: "Article description",
            articleContent: "Article content",
            articleMainImage: `${APP_DOMAIN}public/public/updated_articleimage.png` 
        }
        chai.request(server)
            .post("api/v1/articles/")
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(newArticle)
            .end((err, response) => {
                response.should.have.status(403);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq(403);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Article title already exists!");
                done();
            })
    })

});

describe('GET /api/v1/articles/', () => {

    /**
     * Should GET all articles
     */

    it('It should GET all articles', (done) => {

        chai.request(server)
            .get("api/v1/articles/")
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("All my articles");
                response.body.should.have.property('data').be.a('array');    
                done();
            })
    })

    /**
     * Should NOT GET all articles
     */

    it('It should NOT GET all articles', (done) => {
        chai.request(server)
            .get("api/v1/article/")
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Welcome to Abi-Seth personal portfolio.");
                done();
            })
    })
})

describe('PUT /api/v1/articles/:id', () => {

    /**
     * Should UPDATE an article
     */

    it('It should UPDATE an article', (done) => {
        const articleRad = Math.floor(Math.random()*1000);
        const articleId = '625af557805cd6a36711a736';

        const updateArticle = {
            articleTitle: `Updated article ${articleRad}`,
            articleDescription: `Updated article description ${articleRad}`,
            articleContent: `Updated article content ${articleRad}`,
            articleMainImage: `${APP_DOMAIN}/public/public/updated_article${articleRad}image.png`
        }

        chai.request(server)
            .put(`api/v1/articles/${articleId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .send(updateArticle)
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Article updated successfully!");  
                done();
            })
    })

    /**
     * Should NOT UPDATE to a duplicate articles
     */

    // it('It should NOT UPDATE an article duplicate article titles', (done) => {
    //     const articleId = '6273a2d22b77f8e4bcb5e58f';

    //     const newArticle = {
    //         articleTitle: "New article 503",
    //         articleDescription: "Article description",
    //         articleContent: "Article content",
    //         articleMainImage: `${APP_DOMAIN}public/public/updated_article_image.png` 
    //     }
    //     chai.request(server)
    //         .put(`api/v1/articles/${articleId}`)
    //         .set({ 
    //             Authorization: `Bearer ${token}`
    //         })
    //         .send(newArticle)
    //         .end((err, response) => {
    //             response.should.have.status(400);
    //             response.body.should.be.a('object');
    //             response.body.should.have.property('status').eq(400);
    //             response.body.should.have.property('success').eq(false);
    //             response.body.should.have.property('message').eq("Article title already exists!");
    //             done();
    //         })
    // })

})

describe('GET /api/v1/articles/:id', () => {

    /**
     * Should GET one article (by id)
     */

    it('It should GET one article (by id)', (done) => {
        const articleId = '625af557805cd6a36711a736';

        chai.request(server)
            .get(`api/v1/articles/${articleId}`)
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
     * Should NOT GET an article that does not exist
     */

    it('It should NOT GET an article that does not exist', (done) => {
        const articleId = 'aaa83d7762c3e740d629eaaa';
        chai.request(server)
            .get(`api/v1/articles/${articleId}`)
            .end((err, response) => {
                response.should.have.status(404);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Article not found!");    
                done();
            })
    })

})

describe('DELETE /api/v1/articles/:id', () => {

    /**
     * Should DELETE one article (by id)
     */

    it('It should DELETE one article (by id)', (done) => {
        const articleId = '6275790286ad179068ae4781';

        chai.request(server)
            .delete(`api/v1/articles/${articleId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Article deleted successfully!");
                done();
            })
    })

    /**
     * Should NOT DELETE an article that does not exist
     */

    it('It should NOT DELETE an article that does not exist', (done) => {
        const articleId = 'aaa83d7762c3e740d629eaaa';
        chai.request(server)
            .delete(`api/v1/articles/${articleId}`)
            .set({ 
                Authorization: `Bearer ${token}`
            })
            .end((err, response) => {
                response.should.have.status(404);
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Article not found!");    
                done();
            })
    })

})

describe('POST /api/v1/articles/:id/comment', () => {

    /**
     * Should POST a comment on an article
     */

    it('It should POST a comment on an article', (done) => {
        const articleRad = Math.floor(Math.random()*1000);
        const articleId = '625af557805cd6a36711a736';

        const newComment = {
            commenterName: `Commenter ${articleRad}`,
            commenterEmail: `commenter${articleRad}@gmail.com`,
            commentContent: `Comment content ${articleRad}`
        }

        chai.request(server)
            .post(`api/v1/articles/${articleId}/comment`)
            .send(newComment)
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Commented article successfully!");  
                done();
            })
    })

    /**
     * Should NOT POST a comment on an article that does not exit
     */

    it('It should NOT POST a comment on an article that does not exit', (done) => {
        const articleRad = Math.floor(Math.random()*1000);
        const articleId = 'aaaaf557805cd6a36711a736';

        const newComment = {
            commenterName: `Commenter ${articleRad}`,
            commenterEmail: `commenter${articleRad}@gmail.com`,
            commentContent: `Comment content ${articleRad}`
        }

        chai.request(server)
            .post(`api/v1/articles/${articleId}/comment`)
            .send(newComment)
            .end((err, response) => {
                response.should.have.status(404);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Article not found!");  
                done();
            })
    })

})

describe('POST /api/v1/articles/:id/like', () => {

    /**
     * Should POST a like on an article
     */

    it('It should POST a like on an article', (done) => {
        const articleId = '625af557805cd6a36711a736';

        chai.request(server)
            .post(`api/v1/articles/${articleId}/like`)
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Article liked successfully!");  
                done();
            })
    })

    /**
     * Should NOT POST a like on an article that does not exit
     */

    it('It should NOT POST a like on an article that does not exit', (done) => {
        const articleId = 'aaaaf557805cd6a36711a736';

        chai.request(server)
            .post(`api/v1/articles/${articleId}/like`)
            .end((err, response) => {
                response.should.have.status(404);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Article not found!");  
                done();
            })
    })

})

describe('POST /api/v1/articles/:id/dislike', () => {

    /**
     * Should POST a dislike on an article
     */

    it('It should POST a dislike on an article', (done) => {
        const articleId = '625af557805cd6a36711a736';

        chai.request(server)
            .post(`api/v1/articles/${articleId}/dislike`)
            .end((err, response) => {
                response.should.have.status(200);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(true);
                response.body.should.have.property('message').eq("Article unliked successfully!");  
                done();
            })
    })

    /**
     * Should NOT POST a dislike on an article when it has 0 likes
     */

    it('It should NOT POST a dislike on an article when it has 0 likes', (done) => {
        const articleId = '6256d74f123c6b1e4e694e88';

        chai.request(server)
            .post(`api/v1/articles/${articleId}/dislike`)
            .end((err, response) => {
                response.should.have.status(400);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("This article has 0 likes!");  
                done();
            })
    })

    /**
     * Should NOT POST a dislike on an article that does not exit
     */

    it('It should NOT POST a dislike on an article that does not exit', (done) => {
        const articleId = 'aaaaf557805cd6a36711a736';

        chai.request(server)
            .post(`api/v1/articles/${articleId}/dislike`)
            .end((err, response) => {
                response.should.have.status(404);
                response.should.be.a('object');
                response.body.should.have.property('success').eq(false);
                response.body.should.have.property('message').eq("Article not found!");  
                done();
            })
    })

})
