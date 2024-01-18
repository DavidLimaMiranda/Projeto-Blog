const express = require('express')

const session = require('express-session')

const handlebars = require('express-handlebars')

const bodyParser = require('body-parser')

const Porta = 1324

require("dotenv").config()

require("./.env")

const app = express()

const path = require("path")

const routes = require("./routes/appRoutes")

//config
    //templaye engine
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main',
    runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
    }}))
app.set('view engine', 'handlebars')

// config Sessão
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, maxAge: 2000000000}
}))

// config para usar a pasta uploads pra exibir as imagens
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))

// body parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Utilizando as rotas criadas
app.use("/", routes)

// Rodando o servidor
app.listen(Porta, () => {
    console.log(`Servidor rodando na porta URL localhost:${Porta}`)
})