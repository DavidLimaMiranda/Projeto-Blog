const express = require('express')
const session = require('express-session')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const multer = require("multer")
const app = express()
const Port = 1324
const CreateUser = require('./models/CreateUser')
const Post = require('./models/Post')
const {storage} = require("./multer")
const upload = multer({storage: storage})
const path = require("path")
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
    cookie: {secure: false, maxAge: 200000000}
}))
// config flash, ainda irei utilizar no front futuramente
app.use(flash())

// config para usar a pasta uploads pra exibir as imagens
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))

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

// rota inicial
app.get('/', (req, res) => {
    console.log(req.session.login)
    res.render("home")
})

// rota para login 
app.get('/login', (req, res) => {
    res.render('login')
})

// rota para cadastro
app.get('/cad', (req, res) => {
    res.render('cadastro')
})

// rota para fazer uma postagem para o feed
app.get('/postagem', (req, res) => {
    if(req.session.login){
        res.render("RegistrarPostagens", {usuarioLogado: req.session.login})
    }
})

// rota para ir para o feed de postagens
app.get('/feed', (req, res) => {
    if(req.session.login) {
        Post.findAll().then((post) => {
            res.render('feed', {post: post})
        })
    }
    
})

// Registrando um usuário
app.post('/cadastrar', (req, res) => {
    let erros = []

    // autenticações para registro de usuario
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
        // procurando se á algum usuario cadastrado no banco de dados buscando pelo email
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

// verificando se á uma conta registrada para logar
app.post("/logar", (req, res) => {
    
    // autenticação de login
    if(req.body.email == "" || req.body.passwords == "") {
        console.log("Por favor, Preencher os campos necessários")
        res.redirect('/login')
    }
    else {
        // Procurando se á algum usuario cadastrado buscando pelo email e senha
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

// Registrando postagens dos usuários
app.post('/postar', upload.single("imagem_video") ,(req, res) => {
    const Valido = [
        ".png",
        ".jpg",
        ".jpeg",
        ".bmp",
        ".webp",
        ".gif"
    ]
    if(Valido.includes(path.extname(req.file.filename))){
    Post.create({
        names: req.session.login,
        titulo: req.body.titulo,
        // recebendo o arquivo apos ser tratado no upload
        imagem_video: req.file.filename,
        descricao: req.body.descricao
    }).then(() => {
        console.log("Postagem enviada com sucesso")
        res.redirect("/feed")
    }).catch((error) => {
        console.log(error)
    })
    }
    else {
        console.log("Tipo de arquivo invalido")
    }
})

// Retirando o login do usuario atual logado
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