require('dotenv').config()
const db = require('./db')
// conecxão com a tabela de likes

const Curtiu = db.tabela.define(process.env.DB_TABELA_USERCURTIU, {

    email: {
        type: db.Sequelize.TEXT
    },
    postagem_id: {
        type: db.Sequelize.MEDIUMINT
    }
})

module.exports = Curtiu