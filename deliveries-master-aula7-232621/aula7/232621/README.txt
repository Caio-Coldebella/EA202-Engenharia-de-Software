para a inicalização do programa deve-se primeiro executar 
o container mongo.sh, com o comando ./mongo.sh, após isso 
deve ser chamado ./internetuser.sh usuario papel senha com
o nome, a senha e o papel do usuario, que pode ser admin ou user
, após isso deve se chamar o ./server.sh, perceba que pode
ser necessário colocar sudo antes de tais comandos.
Abirndo localhost:3000 temos na tela inicial os 5 botoes de cima
Usuario Logado: fornece o nome do usuario atual e suas permissoes
Inserir usuario: se estiver logado com um usuario admin pode ser
adicionado outro usuario
Usuarios cadastrados: lista de todos os usuarios cadastrados,
só pode ser acessado por admin e pode ser mudada a senha de qualquer usuario.
Login: Efetua login
Logout: efetua logout

Os usuários com a permissao user podem apenas fazer login, logout,
verificar o usuario atual logado, e verificar os alunos cadastrados
