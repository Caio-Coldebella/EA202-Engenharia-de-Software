const { response } = require('express');
var express = require('express');
var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});
var mongoOp = require('../models/mongo');
var mongoOpusuarios = require('../models/mongo_usuarios');
// codigo abaixo adicionado para o processamento das requisições
// HTTP GET, POST, PUT, DELETE

function checkAuth(req, res) {
    cookies = req.cookies;
    console.log(cookies);
    if (!cookies || !cookies.userAuth) return 'unauthorized';
    cauth = cookies.userAuth;
    var content = JSON.parse(cauth);
    var key = content.key;
    var role = content.role;
    if (key == 'secret') return role
    return 'unauthorized';
}
router.route('/infocookies')
    .get(function(req, res) {
        var response = {}
        if (checkAuth(req, res) == 'unauthorized') {
            response = { "resultado": "Nenhum Usuario Logado" };
            res.json(response)
            return;
        } else {
            cookies = req.cookies;
            uA = cookies.userAuth;
            nA = cookies.nomeAuth;
            var contentuA = JSON.parse(uA);
            var permission = contentuA.role;
            var contentnA = JSON.parse(nA);
            var name = contentnA.role;
            response = { "Usuario": name, "Permissao": permission };
            res.json(response)
        }
    });
// index.html
router.route('/')
    .get(function(req, res) { // GET
        var path = 'index.html';
        res.header('Cache-Control', 'no-cache');
        res.sendFile(path, { "root": "./" });
    });

router.route('/alunos') // operacoes sobre todos os alunos
    .get(function(req, res) { // GET
        if (checkAuth(req, res) == 'unauthorized') {
            res.status(401).send('Unauthorized');
            return;
        }
        var response = {};
        mongoOp.find({}, function(erro, data) {
            if (erro)
                response = { "resultado": "falha de acesso ao BD" };
            else
                response = { "alunos": data };
            res.json(response);
        })
    })
    .post(function(req, res) { // POST (cria)
        if (checkAuth(req, res) != 'admin') {
            res.status(401).send('Unauthorized');
            return;
        }
        var query = { "ra": req.body.ra };
        var response = {};
        mongoOp.findOne(query, function(erro, data) {
            if (data == null) {
                var db = new mongoOp();
                db.ra = req.body.ra;
                db.nome = req.body.nome;
                db.curso = req.body.curso;
                db.save(function(erro) {
                    if (erro) {
                        response = { "resultado": "falha de acesso ao BD" };
                        res.json(response);
                    } else {
                        response = { "resultado": "aluno inserido" };
                        res.json(response);
                    }
                })
            } else {
                response = { "resultado": "aluno ja existente" };
                res.json(response);
            }
        })
    });


router.route('/alunos/:ra') // operacoes sobre um aluno (RA)
    .get(function(req, res) { // GET
        if (checkAuth(req, res) == 'unauthorized') {
            res.status(401).send('Unauthorized');
            return;
        }
        var response = {};
        var query = { "ra": req.params.ra };
        mongoOp.findOne(query, function(erro, data) {
            if (erro) response = { "resultado": "falha de acesso ao BD" };
            else if (data == null) response = { "resultado": "aluno inexistente" };
            else response = { "alunos": [data] };
            res.json(response);
        })
    })
    .put(function(req, res) { // PUT (altera)
        if (checkAuth(req, res) != 'admin') {
            res.status(401).send('Unauthorized');
            return;
        }
        var response = {};
        var query = { "ra": req.params.ra };
        var data = { "nome": req.body.nome, "curso": req.body.curso };
        mongoOp.findOneAndUpdate(query, data, function(erro, data) {
            if (erro) response = { "resultado": "falha de acesso ao DB" };
            else if (data == null) response = { "resultado": "aluno inexistente" };
            else response = { "resultado": "aluno atualizado" };
            res.json(response);
        })
    })
    .delete(function(req, res) { // DELETE (remove)
        if (checkAuth(req, res) != 'admin') {
            res.status(401).send('Unauthorized');
            return;
        }
        var response = {};
        var query = { "ra": req.params.ra };
        mongoOp.findOneAndRemove(query, function(erro, data) {
            if (erro) response = { "resultado": "falha de acesso ao DB" };
            else if (data == null) response = { "resultado": "aluno inexistente" };
            else response = { "resultado": "aluno removido" };
            res.json(response)
        })
    });

router.route('/authentication') // autenticação
    .get(function(req, res) { // GET
        var path = 'login.html';
        res.header('Cache-Control', 'no-cache');
        res.sendFile(path, { "root": "./" });
    })
    .post(function(req, res) {
        var name = req.body.name;
        var pass = req.body.pass;
        // verifica usuario e senha na base de dados
        var query = { "name": name };
        mongoOpusuarios.findOne(query, function(erro, data) {
            if (erro) {
                response = { "resultado": "falha de acesso ao BD" };
                res.json(response);
            } else if (data == null) {
                response = { "resultado": "usuario inexistente" };
                res.json(response);
            } else {
                dados = { "usuarios": [data] };
                if (dados.usuarios[0].name == name && dados.usuarios[0].pass == pass) {
                    var contentP = { "key": "secret", "role": dados.usuarios[0].permission };
                    res.cookie('userAuth', JSON.stringify(contentP), { 'maxAge': 3600000 * 24 * 5 });
                    var contentN = { "key": "secret", "role": dados.usuarios[0].name };
                    res.cookie('nomeAuth', JSON.stringify(contentN), { 'maxAge': 3600000 * 24 * 5 });
                    res.status(200).send('Sucesso');
                } else {
                    res.status(401).send('Falha de autenticacao');
                }
            }
        })
    })
    .delete(function(req, res) {
        var response = {}
        if (checkAuth(req, res) != 'unauthorized') {
            res.clearCookie('userAuth'); // remove cookie no cliente
            response = { "resultado": "Sucesso" };
            res.json(response)
            console.log(res.json)
            return;
        } else {
            response = { "resultado": "Falha" };
            res.json(response)
            return;
        }
    });

router.route('/pag_novo_usuario')
    .get(function(req, res) { // GET
        var path = 'novo_usuario.html';
        res.header('Cache-Control', 'no-cache');
        res.sendFile(path, { "root": "./" });
    });

router.route('/pag_usuarios_cadastrados')
    .get(function(req, res) { // GET
        var path = 'usuarios_cadastrados.html';
        res.header('Cache-Control', 'no-cache');
        res.sendFile(path, { "root": "./" });
    });

router.route('/usuarios') // cadastramento de novos usuarios
    .get(function(req, res) { //O GET deverá retornar uma lista dos usuários já cadastrados.
        if (checkAuth(req, res) != 'admin') {
            res.status(401).send('Unauthorized');
            return;
        }
        var response = {};
        mongoOpusuarios.find({}, function(erro, data) {
            if (erro)
                response = { "resultado": "falha de acesso ao BD" };
            else
                response = { "usuarios": data };
            res.json(response);
        })
    })
    .post(function(req, res) { //O POST deverá permitir a inserção de um novo usuário com novo password. 
        if (checkAuth(req, res) != 'admin') {
            res.status(401).send('Unauthorized');
            return;
        }
        var query = { "name": req.body.name };
        var response = {};
        mongoOpusuarios.findOne(query, function(erro, data) {
            if (data == null) {
                var db = new mongoOpusuarios();
                db.name = req.body.name;
                db.pass = req.body.pass;
                db.permission = req.body.permission;
                db.save(function(erro) {
                    if (erro) {
                        response = { "resultado": "falha de acesso ao BD" };
                        res.json(response);
                    } else {
                        response = { "resultado": "usuario inserido" };
                        res.json(response);
                    }
                });
            } else {
                response = { "resultado": "usuario ja existente" };
                res.json(response);
            }
        })
    })
    .put(function(req, res) { //O PUT deverá permitir a modificação da senha de um usuário já cadastrado. 
        if (checkAuth(req, res) != 'admin') {
            res.status(401).send('Unauthorized');
            return;
        }
        var response = {};
        var name = req.body.name;
        var novasenha = req.body.pass
        var query = { "name": name };
        mongoOpusuarios.findOne(query, function(erro, data) {
            if (erro) {
                response = { "resultado": "falha de acesso ao BD" };
                res.json(response);
            } else if (data == null) {
                response = { "resultado": "usuario inexistente" };
                res.json(response);
            } else {
                var data = { "pass": novasenha };
                mongoOpusuarios.findOneAndUpdate(query, data, function(erro, data) {
                    if (erro) {
                        response = { "resultado": "falha de acesso ao DB" };
                        res.json(response);
                    } else {
                        response = { "resultado": "senha atualizada" };
                        res.json(response);
                    }
                })
            }
        })
    })
    .delete(function(req, res) { //E o DELETE deverá permitir a remoção de um usuário
        if (checkAuth(req, res) != 'admin') {
            res.status(401).send('Unauthorized');
            return;
        }
        var response = {};
        var query = { "name": req.body.name };
        mongoOpusuarios.findOneAndRemove(query, function(erro, data) {
            if (erro) response = { "resultado": "falha de acesso ao DB" };
            else if (data == null) response = { "resultado": "usuario inexistente" };
            else response = { "resultado": "usuario removido" };
            res.json(response);
        })
    });


module.exports = router;