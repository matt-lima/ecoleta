const express = require("express")
const server = express()

// Pegar o banco de dados
const db = require("./database/db.js")
//configurar pasta publica
server.use(express.static("public"))
// habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({extended:true }))

//usando o template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views" ,{
    express: server,
    noCache: true
})

//configuração do caminho da aplicação

//configurar página inicial 
server.get("/", (req, res) => {
   return res.render("index.html", {title: "Um titulo"})
})
server.get("/create-point", (req, res) => {

   //req.query: Query Strings da nossa URL
   //console.log(req.query)
 

   return res.render("create-point.html")
      
})

server.post("/savepoint",(req, res) => {
   //req.body: O corpo do nosso formulario
   //console.log(req.body)

   
    //inserir dados na tabela
    const query = `
      INSERT INTO places (
          image,
          name,
          address,
          address2,
          state,
          city,
          itens 
      ) VALUES ( ?, ?, ?, ?, ?, ?, ?);
    `
    const values = [
      req.body.image,
      req.body.name,
      req.body.address,
      req.body.address2,
      req.body.state,
      req.body.city,
      req.body.itens

  ]
    function afterInsertData(err) {
      if(err){
        return console.log(err)
      }
      console.log("Cadastrado com sucesso")
      console.log(this)
      return res.render("create-point.html", { saved:true})
    }
     db.run(query, values, afterInsertData)

   
})

server.get("/search", (req, res) => {

   const search = req.query.search

   if(search == "") {
      //pesquisa vazia
      return res.render("search-results.html", {total:0})
   }

   //pegar dados do bando de dados
   db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
      if(err){
        return console.log(err)
      } 
      const total = rows.length
      //mostrar a pagina html com os dados dos bancos de dados
      return res.render("search-results.html", {places: rows, total:total})
    }) 


    
 })
//ligar o servidor
server.listen(3000)