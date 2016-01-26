Template.postEdit.onCreated(function() {
  Session.set('postEditErrors', {}); //Crea una variable de error en blanco para esta sesión
});

Template.commentSubmit.helpers({ //Establece los helper para este template
  errorMessage: function(field) {
    return Session.get('commentSubmitErrors')[field]; //Retorna el valor del la casilla de error
  },
  errorClass: function (field) {
    return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : ''; //Retorna la clase de error
  }
});

Template.commentSubmit.events({
  'submit form': function(e, template) {  //al submitear el form ejecutaremos la función que recibirá el template de parámetro
    e.preventDefault(); //Quita la acción por defecto
    var $body = $(e.target).find('[name=body]'); //toma la caja de texto y la inserta en $body
    var comment = { //crea un objeto comment donde estará el contenido del comentario y a donde pertenece
      body: $body.val(), //ajustamos en object.body el valor de $body
      postId: template.data._id //ajustamos el post al cual pertenece el comentario
    };
    var errors = {}; //crea una variable para los errores

    if (! comment.body) { //si no hay nada en object.body
      errors.body = "Please write some content"; //errors.body tendrá este contenido
      return Session.set('commentSubmitErrors', errors); //retornamos un error en la sesión
    }

    Meteor.call('commentInsert', comment, function(error, commentId) {
      //llamamos al método comment insert, donde pasamos el comment cómo parámetro para establecer el comentario en la base de datos
      if (error){ //si hay error
        throwError(error.reason); //Crea el error
      } else { //de lo contrario
        $body.val(''); //limpia el contenido de la caja de texto
      }
    });
  }
});
