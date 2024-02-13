const myMulter = require("../multer/multer")

const HomeController = require("../controllers/ControllerHome")

const LoginController = require("../controllers/ControllerLogin")

const CadastrarController = require("../controllers/ControllerCadastro")

const PostagemController = require("../controllers/ControllerPostagem")

const FeedController = require("../controllers/ControllerFeed")

const PerfilController = require("../controllers/ControllerPerfil")

const ContaController = require("../controllers/ControllerConta")

const LikeController = require("../controllers/ControllerLikes")

const express = require("express")

const routes = express.Router()

// rota inicial
routes.get('/', HomeController.Home)

// rota para login 
routes.get('/login', LoginController.PaginaLogin)

// rota para cadastro
routes.get('/cadastro', CadastrarController.PaginaCadastro)

// rota para fazer uma postagem para o feed
routes.get('/postagem', PostagemController.PaginaPostagem)

// rota para ir para o feed de postagens
routes.get('/feed', FeedController.Feed)

// rota para acessar o perfil do usuario
routes.get('/perfil', PerfilController.PaginaPerfil)

// rota para deletar uma postagem do usuario pelo perfil
routes.get('/perfil/:id', PerfilController.DeletarPostagem)

// rota para editar uma postagem do perfil
routes.get('/perfil/EditarPostagem/:id', PerfilController.PaginaEditarPostagem)

// Registrando um usuário e usando midleware "multer" para baixar a imagem de perfil
routes.post('/cadastrar', myMulter.single("foto_perfil") , CadastrarController.Cadastrar)

// Logando em uma conta
routes.post("/logar", LoginController.Login)

// Registrando postagens dos usuários e usando midleware "multer" para baixar a imagem da postagem
routes.post('/postar', myMulter.single("imagem") , PostagemController.Postagem)

// Retirando o login do usuario atual logado
routes.post('/deslogar', ContaController.Deslogar)

// Excluindo a conta logada atualmente
routes.post('/ExcluirConta', ContaController.Excluir)

// Editando a caixa de descrição do perfil
routes.post('/EditarDescricao', ContaController.EditarDescricao)

// Editando postagem selecionada
routes.post('/EditarPostagem/:id', myMulter.single("nova_imagem"), PerfilController.EditarPostagem)

// Dando like nas postagens
routes.post('/feed/likes/:id', LikeController.Like)

module.exports = routes