const sequelize = require('sequelize')
const connection = new sequelize('guiapress', 'root', '2004', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection