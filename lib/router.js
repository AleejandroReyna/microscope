Router.configure({
  layoutTemplate: 'layout', //Definimos el layout de nombre layout
  loadingTemplate: 'loading', //template visible mientras los post cargan
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return Meteor.subscribe('notifications');
  } //crea la suscripción desde el router de las bases de datos de posts y notificaciones
});

//Ruta para limitar el número de posts
Router.route('/:postsLimit?', { //en la raiz estará esperando un número el cual de no existir, será igual a 5
  name: 'postsList', //utilizará este template
  waitOn: function() { //ejecutará esta función
    var limit = parseInt(this.params.postsLimit) || 5; //tomará el valor entero que se le envía o de no existir, será un 5
    return Meteor.subscribe('posts', {sort: {submitted: -1}, limit: limit}); //retornará una suscripción con el límite asignado alineados del más reciente al más antiguo
  },
  data: function() {
    var limit = parseInt(this.params.postsLimit) || 5; //checará también el límite asignado en la ruta
    return {
      posts: Posts.find({}, {sort: {submitted: -1}, limit: limit}), //retornará el cursor posts con los componentes de la colección solicitada
    };
  }
});

//limitación de posts por url

//Router.route('/', {name: 'postsList'});
Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return Meteor.subscribe('comments', this.params._id); //creamos la suscripción de comments sólo para los comentarios con el id enviado
  },
  data: function() {
    return Posts.findOne(this.params._id);
  }
});
//Asignamos a postLists la ruta con la diagonal, por defecto, buscará el template
//con el cual se le está asignando la búsqueda, el cual se estará pasando a través
//del {{> yield}}

Router.route('/posts/:_id/edit', { //define el tipo de ruta
  name: 'postEdit', //define el nombre para la llamada de la ruta
  data: function() { return Posts.findOne(this.params._id); } //devuelve el contenido de la ruta
});

Router.route('/submit', {name: 'postSubmit'});
//Ruta para el submit del formulario de creación de post

var requireLogin = function() { //esta función checará si hay un usuario loggeado
  if (! Meteor.user()) { //Compara si no existe un usuario loggeado
    if (Meteor.loggingIn()) { //comprueba que un usuario esté intentando loggearse
      this.render(this.loadingTemplate); //Renderiza el template de carga
    } else {
      this.render('accessDenied'); //nos envía a la ruta para el template de no autorizado
    }
  } else {
    this.next(); //continuará con el proceso pendiente
  }
}

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'}); //Checará si hay un usuario loggeado antes de intentar ejecutarse
