const { Pool } = require("pg")
const ENV = process.env.NODE_ENV || 'development'
const pathToFile = `${__dirname}/../.env.${ENV}`
require('dotenv').config({ path: pathToFile })



if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set")
} else { 
    if(process.env.PGDATABASE){
        console.log(`Connected to ${process.env.PGDATABASE}`)
    }
    else if(process.env.DATABASE_URL){
       // console.log(`Connected to ${process.env.DATABASE_URL}`)
    }
}

const config = {};

if (ENV === "production") {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 2;
  }

const db = new Pool(config);

module.exports = db;