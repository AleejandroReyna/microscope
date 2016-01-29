Template.registerHelper('pluralize', function(n, thing) { //registraremos el helper pluralize que recibe dos parametros, el número y el término que se convertirá en plural
  if (n === 1) { //si el número es igual a uno
    return '1 ' + thing; //retorna el string "1 + {{cosa}}"
  } else {
    return n + ' ' + thing + 's'; //retorna el string "numero + {{cosa}} + s"
  }
});
