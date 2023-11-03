const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const Port = 1324

//config
    //templaye engine
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main',
    runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
    }}))
app.set('view engine', 'handlebars')

// body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/cad', (req, res) => {
    res.render('cadastro')
})

app.get('/feed', (req, res) => {

})

app.listen(Port, () => {
    console.log("servidor está rodando")
})