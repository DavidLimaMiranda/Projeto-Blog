require('dotenv').config()
const db = require('./db')
// conecxão com a tabela de postagens
const Post = db.tabela.define(process.env.DB_TABELA_POSTAGENS, {
    names: {
        type: db.Sequelize.TEXT
    },
    email: {
        type: db.Sequelize.TEXT
    },
    foto_perfil: {
        type: db.Sequelize.STRING
    },
    titulo: {
        type: db.Sequelize.STRING
    },
    imagem: {
        type: db.Sequelize.TEXT
    },
    descricao: {
        type: db.Sequelize.TEXT
    }
})

module.exports = Post