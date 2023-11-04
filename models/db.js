require('dotenv').config()
const Sequelize = require('sequelize')
// conexão com o banco de dados
const tabela = new Sequelize(
    process.env.DB_DATABASE, 
    process.env.DB_ROOT, 
    process.env.DB_SENHA, {
    host: "localhost",
    dialect: 'mysql'
})

module.exports = {
    Sequelize: Sequelize,
    tabela: tabela
}