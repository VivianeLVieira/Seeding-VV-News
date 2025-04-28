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
  test("404: resposnds with NOT FOUND, when the topics table is empty ", () => {
    db.query('DELETE FROM topics RETURNING *;')
    return request(app)
      .get("/api/topics")
      .expect(404)
      .then(({ body: { msg }}) => {
          expect(msg).toBe('No topics found')
      })
  })
})
