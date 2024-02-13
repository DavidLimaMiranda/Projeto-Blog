const User = require("../models/User")

const Post = require("../models/Post")

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

    let erros = []
    
    if (req.body.descricao === "" && !req.file && !req.body.nova_imagem) 
    {
        erros.push({ erro: "Não é possível enviar uma postagem totalmente vazia. Preencha pelo menos um campo." });
        res.render("EditarPostagem", { erros: erros });
    }
    
    else
    {    
        Post.findOne({where: {id: req.params.id}}).then((postagem) => {

            if (req.file)
            {
                postagem.update({
                    imagem: req.file.filename,
                    descricao: req.body.descricao_nova
                })
                .then(() => {
                        
                    res.redirect('/perfil')
                })              
                .catch((error) => {
    
                    erros.push({erro: `Houve um erro interno ao salvar as mudanças: ${error}` })
                    res.render('EditarPostagem', {erros:erros})
                })
            }
            
            else 
            {
                postagem.update({
                    descricao: req.body.descricao_nova
                })
                .then(() => {
                        
                    res.redirect('/perfil')
                })              
                .catch((error) => {
    
                    erros.push({erro: `Houve um erro interno ao salvar as mudanças: ${error}` })
                    res.render('EditarPostagem', {erros:erros})
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