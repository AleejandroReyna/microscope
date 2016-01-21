Template.postSubmit.events({ //se especifican los eventos del Template postSubmit

  'submit form': function(e) { //Se especifica el evento submit del form
    e.preventDefault(); //Se retira el action por defecto
    var post = { // se declara un objeto que contendrá los valores a enviar
      url: $(e.target).find('[name=url]').val(), //parametro url
      title: $(e.target).find('[name=title]').val() //parámetro título
    };

    Meteor.call('postInsert', post, function(error, result) {
    //se intenta llamar al método postInsert
      if (error) { //busca un error
        return alert(error.reason); //Si encuentra errores devuelve el error
      } else if (result.postExists){ //verifica si el objeto result en el método postExists es verdadero
        return alert('This link has already been posted');
      } else {
          Router.go('postPage', {_id: result._id}); //se dirige al post creado
      }
    });

    //post._id = Posts.insert(post); //se crea un post a través del insert
    //Router.go('postPage', post); //Se redirige a la página del post creado
  }
});
