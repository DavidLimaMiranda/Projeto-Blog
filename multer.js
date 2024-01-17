const multer = require("multer")

const path = require("path")

const HomeController = require("./controllers/ControllerHome")
const { home } = require("nodemon/lib/utils")

const storage = multer.diskStorage({
    destination: (req, file, func) => {
        const Valido = 
    [
        ".png",
        ".jpg",
        ".jpeg",
        ".bmp",
        ".webp",
        ".gif"
    ]

        if(Valido.includes(path.extname(file.originalname)))
        {
            func(null, path.resolve("uploads/"))
        }
        else
        {
            func(`Tipo de arquivo inválido volte para a pagina incial, Apenas aceito ${Valido}`)
        }
    },
    filename: (req, file, func) => {
        
        const time = new Date().getTime()

        func(null, `${time}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

module.exports = upload