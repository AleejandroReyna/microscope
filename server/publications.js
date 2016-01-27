Meteor.publish('posts', function(options) { //suscribción post
  check(options, {
    sort: Object,
    limit: Number
  })
  return Posts.find({}, options); //retorna todos los post
});


Meteor.publish('comments', function(postId) { //suscripción comments recibe id del post
  check(postId, String); //verifica que postId sea un string
  return Comments.find({postId: postId}); //retorna comments solo con PostId
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
  //por los parámetros solo devolverá las notificaciones con el userId y que no han sido leídos
});
