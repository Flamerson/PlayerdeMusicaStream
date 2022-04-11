// Libs
const routes = require("express").Router()
const fs = require('fs')
const mysql = require('./connections/mysql').pool
const getStat = require('util').promisify(fs.stat)
const multer = require('multer')
const multerConfig = require('./config/multer')

//Get
// essa rota será aprimorada para se tornar uma documentação.
routes.get("/" , (req ,res) => {
    res.send("Welcome to my api , access '/docs' for more informations!")
})

routes.get("/album/todos", (req,res)=>{
    mysql.getConnection((error , conn)=>{
        if(error){return res.status(500).send({error:error})}
        conn.query(
            'SELECT * FROM album',
            (error, result) => {
                conn.release()
                if(error){return res.status(500).send({error:error})}
                res.status(200).send(result)
            }
        )
    })
})

routes.get("/album/:album", (req , res) => {
    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({error:error})}
        conn.query(
            'SELECT * FROM musicas WHERE album = ?',
            [req.params.album],
            (error, result) => {
                conn.release()
                if(error){return res.status(500).send({error:error})}
                res.status(200).send(result)
            }
        )
    })
})

//requisição de todas as musicas , pedindo no geral
routes.get('/todos' , (req, res) =>{
    mysql.getConnection((error , conn) => {
        if(error){return res.status(500).send({error : error})}
        conn.query(
            'SELECT * FROM musicas',
            (error , result) => {
                conn.release()
                if(error){
                    return res.status(500).send({error: error, response: null})
                }
                res.status(200).send(result)
            }
        )
    })
})

//requisição de musica por genero
routes.get('/genero/:gen', (req,res)=>{
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error:error})}
        conn.query(
            'SELECT * FROM musicas WHERE genero = ?',
            [req.params.gen],
            (error, result) => {
                conn.release()
                if(error){return res.status(500).send({error : error})}
                res.status(200).send(result)
            }
        )
    })
})

// framerate do download , padrão 64k
const highWaterMark = 64

// requisição de audios usada em off agr deixamos o aws s3 fazer isso em produção , mas deixamos para testes
routes.get('/audio/:song', async (req, res) =>{

    const song = req.params.song
    const filePath = `./tmp/uploads/${song}`
    const stat = await getStat(filePath) 
    //console.log(stat) // exibe uma serie de informações sobre o arquivo

    res.writeHead(200 , {
        'Content-Type': 'audio/ogg',
        'Content-Length': stat.size
    })

    const stream = fs.createReadStream(filePath, {highWaterMark})

    stream.on('end', () => console.log('acabou'))

    stream.pipe(res)

})

//Post
// adiciona uma musica ao banco de dados
routes.post('/teste', multer(multerConfig).single('audio') ,(req, res)=>{
    console.log(req.file)

    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error : error})}
        conn.query(
            'INSERT INTO musicas (musicaid , nome ,banda, src, url, album, genero) VALUES (?,?,?,?,?,?,?)',
            [req.body.id, req.body.nome, req.body.banda, req.file.key , req.file.location , req.body.album, req.body.genero],
            (error) => {
                conn.release()
                if(error){
                    return res.status(500).send({ error: error, response: null})
                }
                res.status(201).send({
                    mensagem: 'Musica inserida com sucesso!'
                })
            }
        )
    })
})

//cadastrar album
routes.post('/cadastrar/album', (req,res) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error:error})}
        conn.query(
            'INSERT INTO album (nome) VALUES (?)',
            [req.body.nome],
            (error) => {
                conn.release()
                if(error){
                    return res.status(500).send({error:error})
                }
                res.status(201).send({
                    mensagem: 'Album inserido com sucesso'
                })
            }
        )
    })
})

//Delete


//Update



module.exports = routes; // exporta a nossa rota para onde quiser usar