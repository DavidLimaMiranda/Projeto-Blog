const db = require('./db')
// conecxão com a tabela de usuriaos para cadastro e logins
const Login = db.Sequelize.define('users', {
    email: {
        type: db.Sequelize.TEXT
    },
    passwords: {
        type: db.Sequelize.TEXT
    }
})

module.exports = Login