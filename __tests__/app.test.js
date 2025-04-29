const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const app = require("../db/app.js")
const request = require("supertest")

beforeEach(()=>{
  return seed(data)
})
afterAll(()=>{
  return db.end()
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints }}) => {
        expect(endpoints).toEqual(endpointsJson)
        expect(typeof endpoints).toBe("object")
      })
  })
})

describe("GET /api/topics", () => {
  test("200: Responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics }}) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
          })
        })
      })
  })
  test("404: Responds with NOT FOUND, when the topics table is empty ", () => {
    db.query('DELETE FROM topics;')
    return request(app)
      .get("/api/topics")
      .expect(404)
      .then(({ body: { msg }}) => {
          expect(msg).toBe('No topics found')
      })
  })
})

describe("GET /api/articles", () => {
  test("200: Responds with an array articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String)
          })
        })
      })
  })
  test("200: Responds with articles that should not have 'body' key ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(13)
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body")
        })
      })
  })
  test("200: Responds with articles sorted by date descending (articles.created_at) ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(13)
        expect(articles).toBeSorted({ key: 'created_at', descending: true})
      })
  })
  test("404: Responds with NOT FOUND, when the articles table is empty ", () => {
    db.query('DELETE FROM articles;')
    return request(app)
      .get("/api/articles")
      .expect(404)
      .then(({ body: { msg }}) => {
          expect(msg).toBe('No articles found')
      })
  })
  test("404: Responds with NOT FOUND, when the PATH to the endpoint can NOT be FOUND", () => {
    return request(app)
      .get("/api/articlesInvalid")
      .expect(404)
      .then(({ body: { msg }}) => {
          expect(msg).toBe('Path not found')
      })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object containing the article for an specific ID", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article }}) => {
        expect(article).toHaveLength(1);
        expect(article[0]).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        })
        expect(article[0].article_id).toEqual(2)
        expect(article[0].title).toEqual('Sony Vaio; or, The Laptop')
        expect(article[0].topic).toEqual('mitch')
        expect(article[0].author).toEqual('icellusedkars')
        expect(article[0].body).toEqual('Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.')
        expect(article[0].created_at).toEqual('2020-10-16T05:03:00.000Z')
        expect(article[0].votes).toEqual(0)
        expect(article[0].article_img_url).toEqual('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
      })
  })
  test("404: Responds with NOT FOUND, when the article_id does not exists ", () => {
    return request(app)
    .get("/api/articles/999")
      .expect(404)
      .then(({ body: { msg }}) => {
          expect(msg).toBe('No article found')
      })
  })
  test('400: bad request, endpoint does not exist',()=>{
    return request(app)
      .get("/api/articles/InvalidId")
      .expect(400)
      .then(({ body: { msg }})=>{
          expect(msg).toBe('Bad Request')
      })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an object containing all comments for an specific ID", () => {
    const  expectedOutput = [
      {
        comment_id: 11,
        article_id: 3,
        body: 'Ambidextrous marsupial',
        votes: 0,
        author: 'icellusedkars',
        created_at: "2020-09-19T23:10:00.000Z"
      },
      {
        comment_id: 10,
        article_id: 3,
        body: 'git push origin master',
        votes: 0,
        author: 'icellusedkars',
        created_at: "2020-06-20T07:24:00.000Z"
      }
    ]
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body: { comments }}) => {
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            article_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
          })
        })
        expect(comments).toHaveLength(2);
        expect(comments).toEqual(expectedOutput)
      })
  })
  test("200: Responds with all comments for an specific ID sorted by date descending (comments.created_at) ", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body: { comments }}) => {
        expect(comments).toHaveLength(2)
        expect(comments).toBeSorted({ key: 'created_at', descending: true })
      })
  })
  test("404: Responds with an error, NO comments FOUND for a specific ID", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(404)
      .then(({ body: { msg }}) => {
        expect(msg).toEqual('No comments found')
      })
  })
  test("404: Responds with an error, when the article_id can NOT be FOUND", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body: { msg }}) => {
        expect(msg).toEqual('No article found')
      })
  })
  test("400: Responds with an error, when the article_id is INVALID", () => {
    return request(app)
      .get("/api/articles/invalidId/comments")
      .expect(400)
      .then(({ body: { msg }}) => {
        expect(msg).toEqual('Bad Request')
      })
  })
})

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment using a valid format", () => {
    const newComment = { username: 'butter_bridge', body: 'This is a good article.' }
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment }}) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: expect.any(Number),
          body: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
          created_at: expect.any(String),
        })
      })
  })
  test("201: Responds with the posted comment to an especific article", () => {
    const newComment = { username: 'butter_bridge', body: 'This is a good article.' }
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment }}) => {
        expect(comment.comment_id).toEqual(19)
        expect(comment.article_id).toEqual(2)
        expect(comment.body).toEqual('This is a good article.')
        expect(comment.votes).toEqual(0)
        expect(comment.author).toEqual('butter_bridge')
      })
  })
  test("201: Responds with the posted comment to an especific article, ignoring votes information (votes should start = 0)", () => {
    const newComment = { username: 'butter_bridge', body: 'This is a good article.', votes: 10 }
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment }}) => {
        expect(comment.comment_id).toEqual(19)
        expect(comment.article_id).toEqual(2)
        expect(comment.body).toEqual('This is a good article.')
        expect(comment.votes).toEqual(0)
        expect(comment.author).toEqual('butter_bridge')
      })
  })
  test("404: Responds with an error, comment can not be saved when article_id can NOT be FOUND", () => {
    const newComment = { username: 'butter_bridge', body: 'This is a good article.' }
    return request(app)
      .post("/api/articles/777/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg }}) => {
        expect(msg).toEqual('No article found')
      })
  })
  test("404: Responds with an error, comment can not be saved when username can NOT be FOUND", () => {
    const newComment = { username: 'butter_Invalid', body: 'This is a good article.' }
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg }}) => {
        expect(msg).toEqual('No user found')
      })
  })
  test("404: Responds with an error, when the PATH to the endpoint can NOT be FOUND", () => {
    const newComment = { username: 'butter_bridge', body: 'This is a good article.' }
    return request(app)
      .post("/api/articles/2/commentsInvalid")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg }}) => {
          expect(msg).toBe('Path not found')
      })
  })
  test("400: Responds with an error, comment can not be saved when username was NOT informed", () => {
    const newComment = { usernam: 'butter_bridge', body: 'This is a good article.' }
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg }}) => {
        expect(msg).toEqual('Bad Request')
      })
  })
  test("400: Responds with an error, comment can not be saved when article_id is INVALID", () => {
    const newComment = { usernam: 'butter_bridge', body: 'This is a good article.' }
    return request(app)
      .post("/api/articles/InvalidId/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg }}) => {
        expect(msg).toEqual('Bad Request')
      })
  })
})

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article using a valid format", () => {
    const newUpdate = { inc_votes: 1 }
    return request(app)
      .patch("/api/articles/1")
      .send(newUpdate)
      .expect(200)
      .then(({ body: { article }}) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        })
      })
  })
  test("200: Responds with the updated article, incrising votes", () => {
    const newUpdate = { inc_votes: 5 }
    return request(app)
      .patch("/api/articles/1")
      .send(newUpdate)
      .expect(200)
      .then(({ body: { article }}) => {
        expect(article.article_id).toEqual(1)
        expect(article.title).toEqual('Living in the shadow of a great man')
        expect(article.topic).toEqual('mitch')
        expect(article.author).toEqual('butter_bridge')
        expect(article.body).toEqual('I find this existence challenging')
        expect(article.created_at).toEqual('2020-07-09T20:11:00.000Z')
        expect(article.votes).toEqual(105)
        expect(article.article_img_url).toEqual('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
      })
  })
  test("200: Responds with the updated article, decreasing votes", () => {
    const newUpdate = { inc_votes: -5 }
    return request(app)
      .patch("/api/articles/1")
      .send(newUpdate)
      .expect(200)
      .then(({ body: { article }}) => {
        expect(article.article_id).toEqual(1)
        expect(article.title).toEqual('Living in the shadow of a great man')
        expect(article.topic).toEqual('mitch')
        expect(article.author).toEqual('butter_bridge')
        expect(article.body).toEqual('I find this existence challenging')
        expect(article.created_at).toEqual('2020-07-09T20:11:00.000Z')
        expect(article.votes).toEqual(95)
        expect(article.article_img_url).toEqual('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
      })
  })
  test("200: Responds with the updated article to add votes, ignoring created_at", () => {
    const newUpdate = { inc_votes: 30, created_at: '2020-07-09T20:11:00.000Z' }
    return request(app)
      .patch("/api/articles/1")
      .send(newUpdate)
      .expect(200)
      .then(({ body: { article }}) => {
        expect(article.article_id).toEqual(1)
        expect(article.title).toEqual('Living in the shadow of a great man')
        expect(article.topic).toEqual('mitch')
        expect(article.author).toEqual('butter_bridge')
        expect(article.body).toEqual('I find this existence challenging')
        expect(article.created_at).toEqual('2020-07-09T20:11:00.000Z')
        expect(article.votes).toEqual(130)
        expect(article.article_img_url).toEqual('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
      })
  })
  test("404: Responds with an error, article can not be updated when article_id can NOT be FOUND", () => {
    const newUpdate = { inc_votes: 30 }
    return request(app)
      .patch("/api/articles/888")
      .send(newUpdate)
      .expect(404)
      .then(({ body: { msg }}) => {
        expect(msg).toEqual('No article found')
      })
  })
  test("400: Responds with an error, article can not be updated when inc_votes was NOT informed", () => {
    const newUpdate = { inc_invalid: 30 }
    return request(app)
      .patch("/api/articles/1")
      .send(newUpdate)
      .expect(400)
      .then(({ body: { msg }}) => {
        expect(msg).toEqual('Bad Request')
      })
  })
  test("400: Responds with an error, article can not be updated when article_id is INVALID", () => {
    const newUpdate = { inc_votes: 30 }
    return request(app)
      .patch("/api/articles/invalidId")
      .send(newUpdate)
      .expect(400)
      .then(({ body: { msg }}) => {
        expect(msg).toEqual('Bad Request')
      })
  })
})