require('dotenv').config()
const db = require('./db')
// conecxão com a tabela de postagens
const Post = db.tabela.define(process.env.DB_TABELA_POSTAGENS, {
    names: {
        type: db.Sequelize.TEXT
    },
    titulo: {
        type: db.Sequelize.STRING
    },
    imagem_video: {
        type: db.Sequelize.TEXT
    },
    descricao: {
        type: db.Sequelize.TEXT
    }
})

module.exports = Post