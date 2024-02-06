const User = require("../models/User")

const Post = require("../models/Post")

const path = require("path")

const PaginaPostagem = (req, res) => {

    let erros = []

    if(req.session.login)
    {
        res.render("RegistrarPostagens", {usuarioLogado: req.session.login})
    }
    else 
    {
        erros.push({erro: "Você não esta logado em uma conta para postar algo"})
        res.render("home", {erros: erros})
    }
}

const Postagem = (req, res) => {

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

    if(req.session.login)
    {
        if(req.file == undefined && req.body.descricao == "") 
        {
            erros.push({erro: "Não é possivel enviar uma postagem totalmente vazia, Por favor Preencher 1 campo pelo menos"})
            res.render("RegistrarPostagens", {erros: erros})
        }

        else if(req.body.descricao != "" && req.file == undefined) 
        {
            erros.push({erro: "Não é permitido enviar uma postagem só com uma descrição, Por favor preencher mais 1 campo junto"})
            res.render("RegistrarPostagens", {erros: erros})
        }

        else 
        {
            if(Valido.includes(path.extname(req.file.filename)))
            {
                User.findOne({where: {email: req.session.email}}).then((usuario) => {

                Post.create({
                    foto_perfil: usuario.foto_perfil,
                    names: usuario.names,
                    email: usuario.email,
                    imagem: req.file.filename, // recebendo o arquivo apos ser tratado no upload
                    descricao: req.body.descricao,
                    likes: 0

                }).then(() => {
                    console.log("Postagem enviada com sucesso")
                    res.redirect("/feed")

                }).catch((error) => {
                    console.log(error)
                })
            })
        }
            else 
            {
                erros.push({erro: "Tipo de arquivo inválido"})
                res.render('RegistrarPostagens', {erros: erros})
            }
        }
    }
}

module.exports = {PaginaPostagem, Postagem}