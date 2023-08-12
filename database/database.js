require('dotenv').config()
const sequelize = require('sequelize')

const connection = new sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection