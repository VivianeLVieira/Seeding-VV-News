const db = require("../connection")
const format = require("pg-format")
const { convertTimestampToDate } = require("../utils")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query('DROP TABLE IF EXISTS comments;') 
    .then(() => {
      return db.query('DROP TABLE IF EXISTS articles;')
    })
    .then(() => {
      return db.query('DROP TABLE IF EXISTS users;')
    })
    .then(() => {
      return db.query('DROP TABLE IF EXISTS topics;')
    })
    .then(() => {
      return db.query(`CREATE TABLE topics(
        slug VARCHAR(40) PRIMARY KEY,
        description VARCHAR(500),
        img_url TEXT)`) 
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
        username VARCHAR(50) PRIMARY KEY,
        name VARCHAR(50),
        avatar_url VARCHAR(1000))`) 
    })
    .then(() => {
      return db.query(`CREATE TABLE articles(
        article_id SERIAL PRIMARY KEY,
        title VARCHAR (100),
        topic VARCHAR (40) REFERENCES topics(slug) ON DELETE CASCADE,
        author VARCHAR (50) REFERENCES users(username) ON DELETE CASCADE,
        body TEXT NOT NULL, 
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, 
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000))`) 
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR (50) REFERENCES users(username) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)`) 
    })
    .then(() => {
      const formattedTopics = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      })
      const insertTopicsDataQuery = format(`INSERT INTO topics
        (slug, description, img_url)
        VALUES
        %L
        RETURNING *;`,
        formattedTopics 
      )
      return db.query(insertTopicsDataQuery);
    }) 
    .then(() => {
      const formattedUsers = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      })
      const insertUsersDataQuery = format(`INSERT INTO users
        (username, name, avatar_url)
        VALUES
        %L
        RETURNING *;`,
        formattedUsers 
      )
      return db.query(insertUsersDataQuery);
    }) 
    .then(() => {
      const formattedArticles = articleData.map((article) => {
        return [article.title, article.topic, article.author, article.body, convertTimestampToDate(article).created_at, article.votes, article.article_img_url];
      })
      const insertArticlesDataQuery = format(`INSERT INTO articles
        (title, topic, author, body, created_at, votes, article_img_url)
        VALUES
        %L
        RETURNING *;`,
        formattedArticles 
      )
      return db.query(insertArticlesDataQuery);
    }) 
    .then((result) => {
      const articleMap = {}; 
      for (const article of result.rows) { 

        articleMap[article.title] = article.article_id;
      }
      return articleMap;
    })
    .then((articleMap) => { 
      const formattedComments = commentData.map((comment) => {
        return [articleMap[comment.article_title], comment.body, comment.votes, comment.author, convertTimestampToDate(comment).created_at];
      });

      const insertCommentsDataQuery = format(`INSERT INTO comments
        (article_id, body, votes, author, created_at)
        VALUES
        %L
        RETURNING *;`,
        formattedComments 
      )
      return db.query(insertCommentsDataQuery);
    })
};
module.exports = seed;
