const db = require('./db')
// conecxão com a tabela de postagens
const Post = db.tabela.define('postagens',{
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