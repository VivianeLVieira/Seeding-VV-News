const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
//const app = require("../db/app.js");
const request = require("supertest")

beforeAll(() => seed(data));
afterAll(() => db.end());


/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

describe.skip("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});