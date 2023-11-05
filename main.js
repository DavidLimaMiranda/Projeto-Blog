const express = require('express')
const session = require('express-session')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const app = express()
const Port = 1324
const CreateUser = require('./models/CreateUser')
require("dotenv")
require("./.env")

//config
    //templaye engine
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main',
    runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
    }}))
app.set('view engine', 'handlebars')

// Sessão
app.use(session({
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, maxAge: 20000}
}))
app.use(flash())

//middlewares
app.use((req, res, next) => {
    res.locals.sucess_msg = req.flash("sucess_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})
// body parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// rotas

app.get('/', (req, res) => {
    console.log(req.session.login)
    res.render("home")
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/cad', (req, res) => {
    res.render('cadastro')
})

app.get('/feed', (req, res) => {
    res.render('feed')
})

app.post('/cadastrar', (req, res) => {
    let erros = []

    if(req.body.users == "") 
    {
        erros.push("Por favor, Prencher o campo de nome")
    }

    if(req.body.email == "") 
    {
        erros.push("Por favor, Prencher o campo de email com um email valído")    
    }
    
    if(req.body.passwords != req.body.confirm_passwords)
    {
        erros.push("Senhas incompativeis, Digite novamente com mais cuidado")
    }

    if(erros.length > 0)
    {
        console.log(erros)
        res.redirect('/cad')

    }
    else {
        CreateUser.findOne({where: {email: req.body.email}}).then((usuario) => {
            if (usuario) {
                console.log("Este email já está cadastrado")
                res.redirect('/cad')
            }
            else {
                CreateUser.create({
                    names: req.body.names,
                    email: req.body.email,
                    passwords: req.body.passwords
                })
                .then(() => {
                    res.redirect('/')
                })
                .catch((error) => {
                    console.log(`Houve um erro ao se cadastrar: ${error}`)
                })
            }
        }).catch((error) => {
            console.log("Houve um erro interno: "+ error)
        })
    }
})

app.post("/logar", (req, res) => {
    
    if(req.body.email == "" || req.body.passwords == "") {
        console.log("Por favor, Preencher os campos necessários")
        res.redirect('/login')
    }
    else {
        CreateUser.findOne({where: {email: req.body.email, passwords: req.body.passwords}}).then((usuario) => {
            if(!usuario) {
                console.log("Usuario não encontrado, Senha ou Email errado")
                res.redirect('/login')
            }
            else {
                const {names: names, email: email} = usuario
                req.session.login = names
                console.log(req.session.login)
                res.redirect('/')
            }
        }).catch((error) =>{
            console.log("Houve um erro interno: " +error)
        })
    }  
})

app.post('/deslogar', (req, res) => {
    if(req.session.login) {
        req.session.destroy((error) => {
            if(error) {
                console.log(error)
            }
            else {
                res.redirect('/')
            }
        })
    }
    else {
        console.log("Você não está logado em uma conta no momento")
        res.redirect('/')
    }
})

app.listen(Port, () => {
    console.log("servidor está rodando")
})