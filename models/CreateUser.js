require('dotenv').config()
const db = require('./db')
// conecxão com o banco de dados de usuarios para cadastro e login
const CreateUser = db.tabela.define(process.env.DB_TABELA_USUARIOS,{
    names: {
        type: db.Sequelize.CHAR(80)
    },
    email: {
        type: db.Sequelize.TEXT
    },
    passwords: {
        type: db.Sequelize.TEXT 
    }
})


module.exports = CreateUser