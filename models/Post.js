require('dotenv').config()
const db = require('./db')
// conecxão com a tabela de postagens
const Post = db.tabela.define(process.env.DB_TABELA_POSTAGENS, {

    foto_perfil: {
        type: db.Sequelize.STRING
    },
    names: {
        type: db.Sequelize.STRING
    },
    email: {
        type: db.Sequelize.STRING
    },
    imagem: {
        type: db.Sequelize.STRING
    },
    descricao: {
        type: db.Sequelize.STRING
    },
    likes: {
        type: db.Sequelize.INTEGER
    }
})

module.exports = Post