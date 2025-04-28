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
  test("200: Responds with an object containing with all topics", () => {
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
    db.query('DELETE FROM topics RETURNING *;')
    return request(app)
      .get("/api/topics")
      .expect(404)
      .then(({ body: { msg }}) => {
          expect(msg).toBe('No topics found')
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
      .then((response)=>{
          expect(response.body.msg).toBe("Bad Request")
      })
  })
})