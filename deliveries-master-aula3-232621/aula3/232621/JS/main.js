function funcra(a){
    if (a.value.length >= a.maxLength)
        a.value = a.value.slice(0, a.maxLength-1);
    return a
}

function resposta(){
    const ids = ["nome","ra","datanasc","naturalidade","uni","curso","semestre"];
    const nomes = ["Nome","RA","Data de Nascimento","Naturalidade","Universidade","Curso","Semestre"];
    for (let i = 0; i < 7;i++){
        var x = document.forms["forml"][ids[i]].value;
        if (x == "") {
          alert("Preencha o campo "+nomes[i]);
          return false;
        }
    }
    alert("Submissão Concluída");
    return true;}
