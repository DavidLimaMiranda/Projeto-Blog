const User = require("../models/User")

const Post = require("../models/Post")

const path = require("path")

const  PaginaPerfil = (req, res) => {

    let erros = []

    if(req.session.login) {

    User.findOne({where: {email: req.session.email}}).then((user) => { 
        
        Post.findAll({where: {email: req.session.email}}).then((postagens) => {

            res.render("perfil", 
            {usuario: req.session.login, 
            foto: user.foto_perfil,
            post: postagens, // recebendo todas as postagens feitas pelo usuario
            descricao: user.descricao_perfil,
            publicacoes: postagens.length}) 
        
        })
        .catch((error) => {
            console.log(`Houve um erro interno: ${error}`)
        })
    })
    }
    else {
        erros.push({erro: "Você não esta logado ainda para entrar em seu perfil"})
        res.render("home", {erros: erros})
    }
}

const PaginaEditarPostagem = (req, res) => {

    if(req.session.login) 
    {
        Post.findOne({where: {id: req.params.id}}).then((postagem) => {

            res.render('EditarPostagem', {postagem: postagem})
        })
    }
}

const EditarPostagem = (req, res) => {

    const Valido = 
    [
        ".png",
        ".jpg",
        ".jpeg",
        ".bmp",
        ".webp",
        ".gif"
    ]

    let erros = []
    
    if(req.body.titulo == "" && req.body.imagem_video == undefined && req.body.descricao == "") 
    {
        erros.push({erro: "Não é possivel enviar uma postagem totalmente vazia, Por favor Preencher 1 campo pelo menos"})
        res.render("EditarPostagem", {erros: erros})
    }

    else if(req.body.descricao != "" && req.body.titulo == "" && req.body.imagem_video == undefined) 
    {
        erros.push({erro: "Não é permitido enviar uma postagem só com uma descrição, Por favor preencher mais 1 campo junto"})
        res.render("EditarPostagem", {erros: erros})
    }

    else
    {    
        Post.findOne({where: {id: req.params.id}}).then((postagem) => {

            if (req.file.filename === undefined)
            {
                postagem.update({
                    titulo: req.body.titulo_novo,
                    descricao: req.body.titulo_novo
                })
                .then(() => {
                        
                    res.redirect('/perfil')
                })              
                .catch((error) => {
    
                    erros.push({erro: `Houve um erro interno ao salvar as mudanças: ${error}` })
                    res.render('EditarPostagem', {erros:erros})
                })
            }
            
            else if(Valido.includes(path.extname(req.file.filename)))
            {
                postagem.update({
                    titulo: req.body.titulo_novo,
                    imagem: req.file.filename,
                    descricao: req.body.descricao_nova
                })
                .then(() => {
                        
                    res.redirect('/perfil')
                })              
                .catch((error) => {
    
                console.log(`Houve um erro ao salvar as alterações: ${error}`)
                res.redirect('/perfil')
                })
            }
        })
    } 
}

const DeletarPostagem = (req, res) => {

    if(req.session.login) {

        Post.findOne({where: {id: req.params.id}}).then((postagem) => {
            if(req.session.email != postagem.email) 
            {
                res.render('perfil') 
            }
            else 
            {
                Post.destroy({where: {id: req.params.id}}).then(() => {
    
                    console.log("Postagem deletada")
                    res.redirect('/perfil')
                })
                .catch((error) => {
                    console.log("Houve um erro interno: " + error)
                })
            }
        })
        .catch((error) => {
            console.log(`Houve um erro interno: ${error}`)
        })
    }
    else 
    {
        res.redirect('/')
    }
}

module.exports = 
    {
    PaginaPerfil, 
    PaginaEditarPostagem,
    EditarPostagem, 
    DeletarPostagem
    }