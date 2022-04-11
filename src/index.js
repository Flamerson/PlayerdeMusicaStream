require("dotenv").config()

const express = require("express")
const cors = require("cors")
const morgan = require('morgan')
const app = express()
const port = 4001

app.use(cors()) // liberando o cors para que qualquer um possa realizar requisição , nada seguro mas funcional para nosso desenvolvimento
app.use(express.json()) // aceitando Json , necessário para que consiga utilizar o req.body
app.use(express.urlencoded({ extended: true })) // aqui ele consegue lidar com arquivos mais facilmente
app.use(morgan('dev')) // aqui é que mostra no console algumas informações do server dos requests

app.use(require("./routes"))

// manda para o node qual porta está rondando o servidor.
app.listen(port, ()=>{
    console.log(`Access Url : http://localhost:${port}`)
})