const User = require("../models/User")

const bcrypt = require("bcrypt")

const PaginaLogin = (req, res) => {

    res.render('login')
}


const Login = async (req, res) => {

    let erros = []

    // autenticação de login
    if(req.body.email == "" || req.body.passwords == "") 
    {
        erros.push({erro:"Por favor, Preencher os campos necessários"})
        res.render('login', {erros: erros})
    }
    else 
    {
        // Procurando se á algum usuario cadastrado buscando pelo email e senha
        User.findOne({where: {email: req.body.email}}).then( async (usuario) => {

            if(!usuario) 
            {
                erros.push({erro:"Usuario não encontrado, Senha ou Email errado"})
                res.render('login', {erros: erros})
            }
            else 
            {
                // comparando as senhas scriptadas
                const Valido = await bcrypt.compare(req.body.passwords, usuario.passwords)

                if(Valido) 
                {
                    const {names: names, email: email} = usuario
                    req.session.login = names
                    req.session.email = email
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
            res.redirect('/')
        })
    }  
}

module.exports = {PaginaLogin, Login}