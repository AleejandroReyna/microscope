Template.header.helpers({
  activeRouteClass: function(/* route names */) { //crea el helper activeRouteClass
    console.log(arguments);
    var args = Array.prototype.slice.call(arguments, 0); //convierte el objeto arguments en un array

    args.pop(); //el sistema de templates crea un último dato en el array que no necesitamos

    var active = _.any(args, function(name) { //retornamos true si alguno de los elementos de la lista coincide con
      return Router.current() && Router.current().route.getName() === name // retorna true si un elemento cumple la función
    });

    return active && 'active'; //el true se concatena para devolver un active
  }
});
