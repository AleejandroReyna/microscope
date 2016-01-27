Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading', //template visible mientras los post cargan
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('posts'), Meteor.subscribe('notifications')];
  } //crea la suscripción desde el router de las bases de datos de posts y notificaciones
});
//Definimos el layout de nombre layout

Router.route('/', {name: 'postsList'});
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
