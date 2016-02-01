Meteor.publish('posts', function(options) { //suscribción post
  check(options, {
    sort: Object,
    limit: Number
  })
  return Posts.find({}, options); //retorna todos los post
});

Meteor.publish('singlePost', function(id) { //la suscripción single post recibirá como parámetro el id del post a ver
  check(id, String) //checará que ese id sea de tipo string
  return Posts.find(id); //retornará el post con ese id específico
});


Meteor.publish('comments', function(postId) { //suscripción comments recibe id del post
  check(postId, String); //verifica que postId sea un string
  return Comments.find({postId: postId}); //retorna comments solo con PostId
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
  //por los parámetros solo devolverá las notificaciones con el userId y que no han sido leídos
});

// Meteor.publish('newPosts', function(limit) { //Creamos la publicación para los elementos de manera en que los muestre por defecto desde el más nuevo
//   return Posts.find({}, {sort: {submitted: -1}, limit: limit}); //la función retornará Todos los post, desde su límite, en orden de creación
// });

// Meteor.publish('bestPosts', function(limit) {//Creamos la publicación para los más votados
//   return Posts.find({}, {sort: {votes: -1, submitted: -1}, limit: limit}); //los mostrará en relación con su número de votos en orden asc, seguido por su orden de creación y limitados por el límite
// });
