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
            comment_count: expect.any(Number)
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
  test("200: Responds with articles sorted by date in descending order as default (articles.created_at) ", () => {
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

describe("GET /api/articles?sort_by=x | x= article_id, title, topic, author, body, created_at, votes, or article_img_url",() => {
  test("200: Responds with all articles, sorted by article_id", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(13)
        expect(articles).toBeSorted({ key: 'article_id', descending: true })
      })
  })
  test("200: Responds with all articles, sorted by title", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(13)
        expect(articles).toBeSorted({ key: 'title', descending: true })
      })
  })
  test("200: Responds all articles, sorted by topic", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(13)
        expect(articles).toBeSorted({ key: 'topic', descending: true })
      })
  })
  test("200: Responds with all articles, sorted by author", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(13)
        expect(articles).toBeSorted({ key: 'author', descending: true })
      })
  })
  test("200: Responds with all articles, sorted by created_at", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(13)
        expect(articles).toBeSorted({ key: 'created_at', descending: true })
      })
  })
  test("200: Responds with all articles, sorted by votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(13)
        expect(articles).toBeSorted({ key: 'votes', descending: true })
      })
  })
  test("200: Responds with all articles, sorted by article_img_url", () => {
    return request(app)
      .get("/api/articles?sort_by=article_img_url")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(13)
        expect(articles).toBeSorted({ key: 'article_img_url', descending: true })
      })
  })
  test("200: Responds with all articles when sort_by is undefined, must use sort_by default (created_at) instead", () => {
    return request(app)
      .get("/api/articles?sort_by=")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(13)
        expect(articles).toBeSorted({ key: 'created_at', descending: true })
      })
  })
  test("400: Responds with an error when sort_by is INVALID", () => {
    return request(app)
      .get("/api/articles?sort_by=INVALID")
      .expect(400)
      .then(({body: { msg }}) => {
        expect(msg).toBe('It is not possible to sort by INVALID')
      })
  })
})

describe("GET /api/articles?sort=x&order=y | x= desc or asc and y= one of coluns from articles", () => {
  test("200: Responds with articles when order by article_id and order ASC", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(13)
        expect(articles).toBeSorted({ key: 'article_id', descending: false })
      })
  })
  test("400: Responds with an error when using an INVALID query (sort_B)", () => {
    return request(app)
      .get("/api/articles?sort_B=article_id&order=asc")
      .expect(400)
      .then(({body: { msg }})=>{
        expect(msg).toBe('Invalid query parameter: sort_B')
      })
  })
})

describe("GET /api/articles?order=x | x= desc or asc", () => {
  test("200: Responds with articles sorted by date in descending or (articles.created_at) ", () => {
    return request(app)
      .get("/api/articles?order=Desc")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(13)
        expect(articles).toBeSorted({ key: 'created_at', descending: true})
      })
  })
  test("200: Responds with articles sorted by date in ascending order (articles.created_at) ", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(13)
        expect(articles).toBeSorted({ key: 'created_at', descending: false})
      })
  })
  test('200: Responds with articles when order by is undefined, setting default order instead',() => {
    return request(app)
      .get("/api/articles?order=")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(13)
        expect(articles).toBeSorted({ key: 'created_at', descending: true})
      })
  })
  test('400: Responds with an error when order by is INVALID',() => {
    return request(app)
      .get("/api/articles?order=INVALID")
      .expect(400)
      .then(({body: { msg }})=>{
          expect(msg).toBe('It is not possible to order by INVALID')
      })
  })    
})

describe("GET /api/articles?topic=", () => {
  test("200: Responds with articles when filtering by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats") 
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toHaveLength(1)
        expect(articles).toBeSorted({ key: 'created_at', descending: true })
      })
  })
  test("400: Responds with an error when using an INVALID query (topicCCCCC)", () => {
    return request(app)
      .get("/api/articles?topicCCCCC=cats")
      .expect(400)
      .then(({body: { msg }})=>{
        expect(msg).toBe('Invalid query parameter: topicCCCCC')
      })
  })
  test("404: Responds with an error when using an INVALID topic ", () => {
    return request(app)
      .get("/api/articles?topic=BANANA")
      .expect(404)
      .then(({body: { msg }})=>{
        expect(msg).toBe('No articles found')
      })
  })
})


describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object containing the article for an specific ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article }}) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 100,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          comment_count: 11
        })
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
  test("400: Responds with an error, comment can not be saved when username is NOT informed", () => {
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
  test("200: Responds with the updated article", () => {
    const newUpdate = { inc_votes: 5 }
    return request(app)
      .patch("/api/articles/1")
      .send(newUpdate)
      .expect(200)
      .then(({ body: { article }}) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 105,
          article_img_url: expect.any(String),
        })
      })
  })
  test("200: Responds with the updated article, decreasing votes", () => {
    const newUpdate = { inc_votes: -5 }
    return request(app)
      .patch("/api/articles/1")
      .send(newUpdate)
      .expect(200)
      .then(({ body: { article }}) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 95,
          article_img_url: expect.any(String),
        })
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
  test("400: Responds with an error, article can not be updated when inc_votes is NOT a number", () => {
    const newUpdate = { inc_votes: 'a' }
    return request(app)
      .patch("/api/articles/1")
      .send(newUpdate)
      .expect(400)
      .then(({ body: { msg }}) => {
        expect(msg).toEqual('Bad Request')
      })
  })
  test("400: Responds with an error, article can not be updated when inc_votes is NOT informed", () => {
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

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with no content when comment is deleted", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        expect(response.res.statusMessage).toEqual('No Content')
        expect(response.body).toEqual({})
      })
  })
  test("404: Responds with an error, a comment can NOT be deleted when comment_id do NOT exist", () => {
    return request(app)
      .delete("/api/comments/789")
      .expect(404)
      .then(({ body: { msg }}) => {
        expect(msg).toBe('No comment found')
    })
  })
  test("400: Responds with an error, a comment can NOT be deleted when comment_id is NOT a number", () => {
    return request(app)
      .delete("/api/comments/INVALID")
      .expect(400)
      .then(({ body: { msg }}) => {
        expect(msg).toEqual('Bad Request')
      })
  })
})

describe("GET /api/users", () => {
  test("200: Responds with an array of user", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users }}) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
          })
        })
      })
  })
  test("404: Responds with NOT FOUND, when the user table is empty ", () => {
    db.query('DELETE FROM users')
    return request(app)
    .get("/api/users")
      .expect(404)
      .then(({ body: { msg }}) => {
          expect(msg).toBe('No users found')
      })
  })
})