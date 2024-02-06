require('dotenv').config()
const db = require('./db')
// conecxão com o banco de dados de usuarios para cadastro e login
const User = db.tabela.define(process.env.DB_TABELA_USUARIOS,{
    foto_perfil: {
        type: db.Sequelize.STRING
    },
    names: {
        type: db.Sequelize.CHAR(80)
    },
    email: {
        type: db.Sequelize.STRING
    },
    passwords: {
        type: db.Sequelize.STRING 
    },
    descricao_perfil: {
        type: db.Sequelize.STRING
    },
    publicacoes: {
        type: db.Sequelize.MEDIUMINT
    }
})


module.exports = User