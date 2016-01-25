Template.meteorErrors.helpers({ //sección de helpers
  errors: function() { //establece el helper errors
    return Errors.collection.find(); //retorna la colección de todos los errores
  }
});

Template.meteorError.rendered = function() { //establecemos el error por aparte al renderizarse
  var error = this.data; //establecemos los valores para (este) error
  Meteor.setTimeout(function () { //Seteamos un setTimeout
    Errors.collection.remove(error._id); //Se eliminará el error pasado el tiempo para que no estorbe en la vista
  }, 3000); //pasados los 3 segundos
};
