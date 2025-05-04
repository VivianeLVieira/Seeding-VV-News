const { Pool } = require("pg")
const ENV = process.env.NODE_ENV || 'development'
const pathToFile = `${__dirname}/../../.env.${ENV}`
require('dotenv').config({ path: pathToFile })

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not set")
}

console.log(`Connected to ${ENV}`)

module.exports = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 2,
});

