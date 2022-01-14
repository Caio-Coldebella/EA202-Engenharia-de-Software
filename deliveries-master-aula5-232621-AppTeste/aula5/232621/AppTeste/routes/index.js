var express = require('express');
var router = express.Router();
const fs = require('fs');
var local;
local = fs.readFileSync('./arquivo.txt', 'utf8');
local = JSON.parse(local);
/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

router.route('/*') 
 .options(function(req, res) {  // OPTIONS
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Request-With');
   res.sendStatus(200);
   }
 );

// index.html
router.route('/')
 .get(function(req, res) {  // GET
   var path = 'index.html';
   res.header('Cache-Control', 'no-cache');
   res.sendFile(path, {"root": "./"});
   }
 );

router.route('/alunos') // operacoes sobre todos os alunos
  .get(function(req, res) {  // GET
      var response = {"local":[]};
      if (local.size!=0){
          var x;
          for (x of local){
              response.local.push(x);            
            }
      }
      res.json(response);    
}
 );
router.route('/alunos')
  .post(function(req, res) {   // POST (cria)
      var response = {};
      var inserir = req.body
      var y;
      for(y = 0; y < local.length; ++y){
          if(local[y].ra == inserir.ra){
              response = {"resultado" : "aluno ja existente"};
              res.json(response);
              return;    
            }
        }
      local.push(inserir);        
      response = {"resultado" : "aluno inserido"};
      res.json(response);
      fs.writeFileSync('./arquivo.txt', JSON.stringify(local));        
  });


router.route('/alunos/:id')   // operacoes sobre um aluno (ID)
  .get(function(req, res) {   // GET
    var response = {};
    var i;
    i = req.params.id;
    var y;
    for(y = 0; y < local.length; ++y){
        if(local[y].ra == i){
            res.json(local[y]);
            return;    
          }
      }
    response = {"resultado" : "aluno nao existente"};
    res.json(response);
    }
  );
router.route('/alunos/:id')  
  .put(function(req, res) {   // PUT (altera)
    var response = {};
    var i;
    i = req.params.id;
    var y;
    for(y = 0; y < local.length; ++y){
        if(local[y].ra == i){
            local[y]=req.body;
            response = {"resultado" : "aluno atualizado"};
            res.json(response);
            fs.writeFileSync('./arquivo.txt', JSON.stringify(local)); 
            return;    
          }
      }
    response = {"resultado" : "aluno nao existente"};
    res.json(response);
    }
  );
function removenull (lista){
  var aux = [];
  var i;
  for(i=0;i<lista.length;++i){
    if(lista[i]!=null){
      aux.push(lista[i])
    }
  }
  return aux;
}
router.route('/alunos/:id')
  .delete(function(req, res) {   // DELETE (remove)
    var response = {};
    var i;
    i = req.params.id;
    var y;
    for(y = 0; y < local.length; ++y){
      if(local[y].ra == i){
            delete local[y];
            local = removenull(local);
            response = {"resultado" : "aluno removido"};
            res.json(response);
            fs.writeFileSync('./arquivo.txt', JSON.stringify(local)); 
            return;    
          }
      }
    response = {"resultado" : "aluno nao existente"};
    res.json(response);
    }
  );    


module.exports = router;