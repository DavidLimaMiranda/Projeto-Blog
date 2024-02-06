const Post = require("../models/Post")

const Feed = (req, res) => {

    let erros = []

    if(req.session.login) 
    {
        Post.findAll().then((post) => { 
                res.render('feed', {post: post})
        })
    }
    else 
    {
        erros.push({erro: "Você não esta logado ainda para navegar no feed"})
        res.render("home", {erros: erros})
    }
}

module.exports = {Feed}