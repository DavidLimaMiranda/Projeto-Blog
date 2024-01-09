const express = require('express')

const session = require('express-session')

const handlebars = require('express-handlebars')

const bodyParser = require('body-parser')

const multer = require("multer")

require("dotenv")

require("./.env")

const app = express()

const {storage} = require("./multer")

const upload = multer({storage: storage})

const path = require("path")

const LoginController = require("./controllers/ControllerLogin")

const CadastrarController = require("./controllers/ControllerCadastro")

const PostagemController = require("./controllers/ControllerPostagem")

const FeedController = require("./controllers/ControllerFeed")

const PerfilController = require("./controllers/ControllerPerfil")

const ContaController = require("./controllers/ControllerConta")

const LikeController = require("./controllers/ControllerLikes")

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
app.get('/', (req, res) => { res.render("home") })

// rota para login 
app.get('/login', LoginController.PaginaLogin)

// rota para cadastro
app.get('/cadastro', CadastrarController.PaginaCadastro)

// rota para fazer uma postagem para o feed
app.get('/postagem', PostagemController.PaginaPostagem)

// rota para ir para o feed de postagens
app.get('/feed', FeedController.Feed)

// rota para acessar o perfil do usuario
app.get('/perfil', PerfilController.PaginaPerfil)

// rota para deletar uma postagem do usuario pelo perfil
app.get('/perfil/:id', PerfilController.DeletarPostagem)

// rota para editar uma postagem do perfil
app.get('/perfil/EditarPostagem/:id', PerfilController.PaginaEditarPostagem)

// Registrando um usuário e usando midleware "multer" para baixar a imagem de perfil
app.post('/cadastrar', upload.single("foto_perfil") , CadastrarController.Cadastrar)

// Logando em uma conta
app.post("/logar", LoginController.Login)

// Registrando postagens dos usuários e usando midleware "multer" para baixar a imagem da postagem
app.post('/postar', upload.single("imagem") , PostagemController.Postagem)

// Editando a postagem selecionada pelo usuario e usando midleware "multer" para trocar a imagem da postagem
app.post('/EditarPostagem/:id', upload.single("nova_imagem"), PerfilController.EditarPostagem)

// Retirando o login do usuario atual logado
app.post('/deslogar', ContaController.Deslogar)

// Excluindo a conta logada atualmente
app.post('/ExcluirConta', ContaController.Excluir)

// Editando a caixa de descrição do perfil
app.post('/EditarDescricao', ContaController.EditarDescricao)

// Dando like nas postagens
app.post('/feed/likes/:id', LikeController.Like)


app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta URL localhost:${PORT}`)
})