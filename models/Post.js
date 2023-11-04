require('dotenv').config()
const db = require('./db')
// conecxão com a tabela de postagens
const Post = db.tabela.define(process.env.DB_TABELA_POSTAGENS, {
    user: {
        type: db.Sequelize.TEXT
    },
    titulo: {
        type: db.Sequelize.STRING
    },
    conteudo: {
        type: db.Sequelize.TEXT
    }
})

module.exports = Post