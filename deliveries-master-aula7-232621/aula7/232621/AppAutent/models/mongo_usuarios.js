var mongoose = require("mongoose");
conn1 = mongoose.createConnection('mongodb://mongo:27017/usuariosDB', { useNewUrlParser: true });
var Schema = mongoose.Schema;
var usuariosSchema = new Schema({
    "name": String,
    "pass": String,
    "permission": String
});
module.exports = conn1.model('usuarios', usuariosSchema);