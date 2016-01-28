Router.configure({
  layoutTemplate: 'layout', //Definimos el layout de nombre layout
  loadingTemplate: 'loading', //template visible mientras los post cargan
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return Meteor.subscribe('notifications');
  } //crea la suscripción desde el router de las bases de datos de posts y notificaciones
});

//Ruta para limitar el número de posts

////// controlador para ir extendiendo la URL //////

PostsListController = RouteController.extend({ //El router Controller se encargará del proceso
//Debemos recordar que el nombre de la variable que guardará el controller debe concordar
//Con el nombre del template y de la ruta

 template: 'postsList', //usará el template postsList
 increment: 5, //empezará con un valor inicial de 5
 postsLimit: function() {
   return parseInt(this.params.postsLimit) || this.increment;
   //retornará su valor, o en su defecto retornará valor inicial de 5
 },
 findOptions: function() {
   return {sort: {submitted: -1}, limit: this.postsLimit()};
   //retornará las opciones usadas para retornar la suscripción y el cursor con los params postsLimit
 },
 subscriptions: function() {
   this.postsSub = Meteor.subscribe('posts', this.findOptions());
   //guradará en propiedad postsSub la suscripción a la colección con los parámetros de findOptions
 },
 posts: function() {
   return Posts.find({}, this.findOptions());
 },
 data: function() {
   var hasMore = this.posts().count() === this.postsLimit(); //guarda true si el total de los post es igual al límite
   var nextPath = this.route.path({postsLimit: this.postsLimit() + this.increment}); //guarda la ruta del template actual, añadiendole a la propiedad postLimit el increment
   return { //retorna el cursor con
     posts: this.posts(), //los posts
     ready: this.postsSub.ready, //true o false si los post están listos ya
     nextPath: hasMore ? nextPath : null //compara si hasmore es true, de ser manda nextpath, de no serlo envía null
   };
 }
});

////// - controlador para ir extendiendo la URL - //////

Router.route('/:postsLimit?', {
  name: 'postsList'
});

/* DEJAREMOS ESTE CÓDIGO AQUÍ PARA CUANDO SE NECESITE EXPLICAR

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

*/
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
