require('dotenv').config()
const db = require('./db')
// conecxão com o banco de dados de usuarios para cadastro e login
const CreateUser = db.tabela.define(process.env.DB_TABELA_USUARIOS,{
    foto_perfil: {
        type: db.Sequelize.TEXT
    },
    names: {
        type: db.Sequelize.CHAR(80)
    },
    email: {
        type: db.Sequelize.TEXT
    },
    passwords: {
        type: db.Sequelize.TEXT 
    },
    descricao_perfil: {
        type: db.Sequelize.TEXT
    },
    publicacoes: {
        type: db.Sequelize.MEDIUMINT
    }
})


module.exports = CreateUser