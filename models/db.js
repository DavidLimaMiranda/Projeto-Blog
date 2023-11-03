const Sequelize = require('sequelize')
// conexão com o banco de dados
const tabela = new Sequelize('postapp', 'root', `${senha}`, {
    host: "localhost",
    dialect: 'mysql'
})

module.exports = {
    Sequelize: Sequelize,
    tabela: tabela
}