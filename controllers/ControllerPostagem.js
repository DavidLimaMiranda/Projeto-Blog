const User = require("../models/User")

const Post = require("../models/Post")

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

    if (req.body.imagem == undefined &&  req.body.descricao === "") 
    {
        erros.push({ erro: "Não é possível enviar uma postagem totalmente vazia. Preencha os campos necessários." });
    } 
    else if (!req.file) 
    {
        erros.push({ erro: "Tipo de arquivo inválido, Apenas fotos/gifs." })  
    } 
    if (erros.length > 0) 
    {
        res.render("RegistrarPostagens", { erros: erros })
    }

    else 
    {
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
    }
}


module.exports = {PaginaPostagem, Postagem}