const multer = require("multer")

const path = require("path")

const storage = multer.diskStorage({
    destination: path.join(__dirname, "..", "uploads"),

    filename: (req, file, cb) => {
        
        const time = new Date().getTime()

        cb(null, `${time}-${file.originalname}`)
    }
})

const validation = multer({ 
    storage: storage ,

    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (req, file, cb) => {

        const Valido = [
            ".png",
            ".jpg",
            ".jpeg",
            ".bmp",
            ".webp",
            ".gif"
        ]

        if(!Valido.includes(path.extname(file.originalname)))
        {
            cb(null, false)
        }
        else
        {
            cb(null, true)
        }
    }
})

module.exports = validation