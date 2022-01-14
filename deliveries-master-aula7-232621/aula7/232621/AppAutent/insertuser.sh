#! /bin/bash
docker exec -it mongo bash -c 'mongo mongodb://mongo:27017/usuariosDB <<EOF
db.usuarios.insert({
	name: "'"$1"'",
	pass:"'"$3"'",
	permission:"'"$2"'"
})
EOF'
