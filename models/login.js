require('dotenv').config()
const db = require('./db')
// conecxão com a tabela de usuriaos para cadastro e logins
const Login = db.Sequelize.define(process.env.DB_TABELA_USUARIOS, {
    email: {
        type: db.Sequelize.STRING
    },
    passwords: {
        type: db.Sequelize.STRING
    }
})

module.exports = Login