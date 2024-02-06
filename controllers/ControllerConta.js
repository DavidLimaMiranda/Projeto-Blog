const User = require("../models/User")

const Post = require("../models/Post")

const Deslogar = (req, res) => {

    let erros = []

    if(req.session.login) 
    {
        req.session.destroy((error) => {
            if(error) 
            {
                console.log(error)
            }
            else 
            {
                res.redirect('/login')
            }
        })
    }
    else {
        erros.push({erro: "Você não está logado em uma conta no momento"})
        res.render('login', {erros: erros})
    }
}

const Excluir = (req, res) => {

    if(req.session.login)
    {
        User.findOne({where: {email: req.session.email}}).then((user) => {

            Post.destroy({where: {email: user.email}}).then(() => {

                user.destroy({where: {email: user.email}}).then(() => {

                    req.session.login = undefined
                    res.render('/home', {erro: "Conta deletada com sucesso!"})
                })
            })
            .catch((error) => 
            {
                console.log("Houve um erro interno" + error)
            })
        })
        .catch((error) => 
        {
            console.log("Houve um erro interno" + error)
        })
    }
    else 
    {
        res.redirect("/")
    }
}

const EditarDescricao = (req, res) => {

    if(req.session.login) 
    {
        User.findOne({where: {email: req.session.email}}).then((user) => {

            user.update({
                descricao_perfil: req.body.nova_descricao
            })
            .then(() => {
                res.redirect('/perfil')
            })
            .catch((error) => {
                console.log(`Houve um erro ao salvar as mudanças: ${error}`)
                res.redirect('/perfil')
            })
        })
    }
}

module.exports = {Deslogar, Excluir, EditarDescricao}