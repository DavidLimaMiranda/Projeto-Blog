require('dotenv').config()
const Sequelize = require('sequelize')
// conexão com o banco de dados MySQL
const tabela = new Sequelize(
    process.env.DB_DATABASE, 
    process.env.DB_ROOT, 
    process.env.DB_SENHA, 
    {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
})

module.exports = {
    Sequelize: Sequelize,
    tabela: tabela
}