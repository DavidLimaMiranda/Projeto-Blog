require('dotenv').config()

module.exports= 
{
  "development": {
    "username": process.env.DB_ROOT,
    "password": process.env.DB_SENHA,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": process.env.DB_DIALECT,
    "logging": true
  },
  "test": {
    "production": {
      "username": process.env.DB_ROOT,
      "password": process.env.DB_SENHA,
      "database": process.env.DB_DATABASE,
      "host": process.env.DB_HOST,
      "port": process.env.DB_PORT,
      "dialect": process.env.DB_DIALECT  
    }
  },
  "production": {
    "username": process.env.DB_ROOT,
    "password": process.env.DB_SENHA,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": process.env.DB_DIALECT  
  }
}
