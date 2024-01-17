const User = require("../models/User")

const Post = require("../models/Post")

const Curtiu = require("../models/UserCurtiu")

const Like = (req, res) => {

    Curtiu.findOne({where: {postagem_id: req.params.id}}).then((curtiu) => {

        Post.findOne({where: {id: req.params.id}}).then((postagem) => {

            User.findOne({where: {email: req.session.email}}).then((user) => {

                // verificando se é o mesmo email logado que fez a postagem
                if(postagem.email === user.email)
                {
                    console.log("Você não pode curtir sua propria postagem!!!")
                    res.redirect('/feed')
                }
                
                else
                {
                    // verificando se o usuario curtiu a postagem já
                    if(curtiu)
                    {
                        postagem.update({
                            likes: (postagem.likes - 1)
                        })                
                        .then(() => {

                            // deletando no banco que ele já curtiu para que possa recolocar o like
                            curtiu.destroy({where: {postagem_id: req.params.id}}).then(() => {

                                res.redirect('/feed')
                            })
                        })
                    }
                    else 
                    {   
                        postagem.update({
                            likes: (postagem.likes + 1)
                        })
                        .then(() => {
                            // registrando que o usuario com o email logado curtiu a postagem
                            Curtiu.create({
                                email: req.session.email,
                                postagem_id: postagem.id
                            })
                            res.redirect('/feed')
                        })
                    }
                } 
            })
        })
    })
}

module.exports = {Like}