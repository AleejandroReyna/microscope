Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading', //template visible mientras los post cargan
  waitOn: function() { return Meteor.subscribe('posts'); } //crea la suscripción desde el router
});
//Definimos el layout de nombre layout

Router.route('/', {name: 'postsList'});
//Asignamos a postLists la ruta con la diagonal, por defecto, buscará el template
//con el cual se le está asignando la búsqueda, el cual se estará pasando a través
//del {{> yield}}
