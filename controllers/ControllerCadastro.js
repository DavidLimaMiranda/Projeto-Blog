const User = require("../models/User")

const Curtiu = require("../models/UserCurtiu")

const path = require("path")

const bcrypt = require("bcrypt")

// Renderizar a pagina de cadastro
const PaginaCadastro = (req, res) => {

    return res.render("cadastro")
}

// Controller de cadastros
const Cadastrar = async (req, res) => {

    let erros = []
    const Valido = 
    [
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

    if(req.body.email == "") 
    {
        erros.push({erro: "Por favor, Prencher o campo de email com um email valído"})    
    }
    
    if(req.body.passwords != req.body.confirm_passwords || req.body.passwords == "")
    {
        erros.push({erro: "Senhas incompativeis, Digite novamente com mais cuidado"})
    }
    if(erros.length > 0)
    {
        console.log(erros)
        res.render('cadastro', {erros: erros})
    }
    else {
        // Criptografando a senha passada pelo usuario
        const hashPasswords = await bcrypt.hash(req.body.passwords, 12)

        // procurando se á algum usuario cadastrado no banco de dados buscando pelo email
        User.findOne({where: {email: req.body.email}}).then((usuario) => {

            if (usuario) 
            {
                erros.push({erro: "Este emai já esta cadastrado"})
                res.render('cadastro', {erros: erros})
            }

            else {
                
                if(Valido.includes(path.extname(req.file.filename))) 
                {
                    User.create({
                    foto_perfil: req.file.filename,
                    names: req.body.names,
                    email: req.body.email,
                    passwords: hashPasswords, // Passando a senha criptografada
                    descricao_perfil: "Olá, Sou novo aqui.",
                    publicacoes: 0

                }).then((user) => {
                    // Criando o cookie do nome e login
                    const {names: names, email: email} = user
                    req.session.login = names
                    req.session.email = email

                    // criando tabela de curtidas do usuario
                    Curtiu.create({

                        email: user.email,
                        postagem_id: 0
                    })
                    res.redirect('/feed')

                }).catch((error) => {
                    console.log(`Houve um erro ao se cadastrar: ${error}`)
                })
                }
                else
                {
                    erros.push({erro: "Esse tipo de arquivo não é permitido"})
                    res.render('cadastro', {erros})
                }
            }
        })
    }
}

module.exports = { PaginaCadastro, Cadastrar }