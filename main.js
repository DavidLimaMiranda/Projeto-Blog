const express = require('express')

const session = require('express-session')

const handlebars = require('express-handlebars')

const bodyParser = require('body-parser')

const flash = require('connect-flash')

const multer = require("multer")

const bcrypt = require("bcrypt")

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

// config Sessão
app.use(session({
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, maxAge: 200000000}
}))

// config para usar a pasta uploads pra exibir as imagens
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))

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
app.get('/cadastro', (req, res) => {
    res.render('cadastro',)
})

// rota para fazer uma postagem para o feed
app.get('/postagem', (req, res) => {
    let erros = []
    if(req.session.login){
        res.render("RegistrarPostagens", {usuarioLogado: req.session.login})
    }
    else {
        erros.push({erro: "Você não esta logado em uma conta para postar algo"})
        res.render("home", {erros: erros})
    }
})

// rota para ir para o feed de postagens
app.get('/feed', (req, res) => {
    let erros = []
    if(req.session.login) {
        Post.findAll().then((post) => {
            res.render('feed', {post: post})
        })
    }
    else {
        erros.push({erro: "Você não esta logado ainda"})
        res.render("home", {erros: erros})
    }
    
})

app.get('/perfil', async (req, res) => {
    let erros = []

    if(req.session.login) {
    CreateUser.findOne({where: {email: req.session.email}}).then((user) => { 
        
        Post.findAll({where: {email: req.session.email}}).then((postagens) => {

            res.render("perfil", 
            {usuario: req.session.login, 
            foto: user.foto_perfil, 
            post: postagens}) // recebendo todas as postagens feitas pelo usuario
        
        })
        .catch((error) => {
            console.log(`Houve um erro interno: ${error}`)
        })
    })
    }
    else {
        erros.push({erro: "Você não esta logado ainda"})
        res.render("home", {erros: erros})
    }
})

// Registrando um usuário
app.post('/cadastrar', upload.single("foto_perfil") ,async (req, res) => {
    let erros = []
    const Valido = [
        ".png",
        ".jpg",
        ".jpeg",
        ".bmp",
        ".webp",
        ".gif"
    ]

    // autenticações para registro de usuario
    if(req.body.names == "") 
    {
        erros.push({erro: "Por favor, Prencher o campo de nome"})
    }

    else if(req.body.email == "") 
    {
        erros.push({erro: "Por favor, Prencher o campo de email com um email valído"})    
    }
    
    else if(req.body.passwords != req.body.confirm_passwords || req.body.passwords == "")
    {
        erros.push({erro: "Senhas incompativeis, Digite novamente com mais cuidado"})
    }
    else if(erros.length > 0)
    {
        console.log(erros)
        res.render('cadastro', {erros: erros})
    }
    else {
        // Criptografando a senha passada pelo usuario
        const hashPasswords = await bcrypt.hash(req.body.passwords, 12)

        // procurando se á algum usuario cadastrado no banco de dados buscando pelo email
        CreateUser.findOne({where: {email: req.body.email}}).then((usuario) => {

            if (usuario) {

                console.log("Este email já está cadastrado")
                res.redirect('/cadastro')
            }

            else {
                if(Valido.includes(path.extname(req.file.filename))) {

                    CreateUser.create({
                    foto_perfil: req.file.filename,
                    names: req.body.names,
                    email: req.body.email,
                    passwords: hashPasswords

                }).then(() => {
                    res.redirect('/')

                }).catch((error) => {
                    console.log(`Houve um erro ao se cadastrar: ${error}`)
                })
            }
        }
        }).catch((error) => {
            console.log("Houve um erro interno: "+ error)
            erros.push({erro: "Inserir foto de perfil valída"})
            res.render('cadastro', {erros: erros})
        })
    }
})

// verificando se á uma conta registrada para logar
app.post("/logar", (req, res) => {
    let erros = []
    // autenticação de login
    if(req.body.email == "" || req.body.passwords == "") {
        erros.push({erro:"Por favor, Preencher os campos necessários"})
        res.render('login', {erros: erros})
    }
    else {
        // Procurando se á algum usuario cadastrado buscando pelo email e senha
        CreateUser.findOne({where: {email: req.body.email}}).then( async (usuario) => {
            if(!usuario) {
                erros.push({erro:"Usuario não encontrado, Senha ou Email errado"})
                res.render('login', {erros: erros})
            }
            else {
                // comparando as senhas scriptadas
                const Valido = await bcrypt.compare(req.body.passwords, usuario.passwords)
                console.log(Valido)
                if(Valido) 
                {
                    const {names: names, email: email} = usuario
                    req.session.login = names
                    req.session.email = email
                    console.log(req.session.login)
                    res.redirect('/feed')  
                }
                else 
                {
                    erros.push({erro:"Usuario não encontrado, Senha ou Email errado"})
                    res.render('login', {erros: erros})
                }
                    
            }
        }).catch((error) =>{
            console.log("Houve um erro interno: " +error)
        })
    }  
})

// Registrando postagens dos usuários
app.post('/postar', upload.single("imagem") ,(req, res) => {
    const Valido = [
        ".png",
        ".jpg",
        ".jpeg",
        ".bmp",
        ".webp",
        ".gif"
    ]

    let erros = []

    if(req.body.titulo == "" && req.body.imagem_video == undefined && req.body.descricao == "") {

        erros.push({erro: "Não é possivel enviar uma postagem totalmente vazia, Por favor Preencher 1 campo pelo menos"})
        res.render("RegistrarPostagens", {erros: erros})
    }

    else if(req.body.descricao != "" && req.body.titulo == "" && req.body.imagem_video == undefined) {

        erros.push({erro: "Não é permitido enviar uma postagem só com uma descrição, Por favor preencher mais 1 campo junto"})
        res.render("RegistrarPostagens", {erros: erros})
    }

    else {

        if(Valido.includes(path.extname(req.file.filename))){

            CreateUser.findOne({where: {email: req.session.email}}).then((usuario) => {

            Post.create({
                names: req.session.login,
                email: req.session.email,
                foto_perfil: usuario.foto_perfil, // recebendo a foto do usuario para mostrar no feed
                titulo: req.body.titulo,
                imagem: req.file.filename, // recebendo o arquivo apos ser tratado no upload
                descricao: req.body.descricao

            }).then(() => {
                console.log("Postagem enviada com sucesso")
                res.redirect("/feed")

            }).catch((error) => {
                console.log(error)
            })
        })
    }
        else {
            console.log("Tipo de arquivo invalido")
        }
    }})

app.post('/deletarpostagem', (req, res) => {
    Post.find({where: {id: id}}).then((postagem) => {
        postagem.destroy()
    })
})

// Retirando o login do usuario atual logado
app.post('/deslogar', (req, res) => {
    let erros = []
    if(req.session.login) {
        req.session.destroy((error) => {
            if(error) {
                console.log(error)
            }
            else {
                res.redirect('/')
            }
        })}
    else {
        erros.push({erro: "Você não está logado em uma conta no momento"})
        res.render('home', {erros: erros})
    }
})


app.listen(Port, () => {
    console.log(`Servidor rodando na porta URL localhost:${Port}`)
})