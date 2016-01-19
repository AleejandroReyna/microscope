Template.postSubmit.events({ //se especifican los eventos del Template postSubmit

  'submit form': function(e) { //Se especifica el evento submit del form
    e.preventDefault(); //Se retira el action por defecto
    var post = { // se declara un objeto que contendrá los valores a enviar
      url: $(e.target).find('[name=url]').val(), //parametro url
      title: $(e.target).find('[name=title]').val() //parámetro título
    };

    post._id = Posts.insert(post); //se crea un post a través del insert
    Router.go('postPage', post); //Se redirige a la página del post creado
  }
});
