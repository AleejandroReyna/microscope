Meteor.publish('posts', function() { //suscribción post
  return Posts.find(); //retorna todos los post
});


Meteor.publish('comments', function(postId) { //suscripción comments recibe id del post
  check(postId, String); //verifica que postId sea un string
  return Comments.find({postId: postId}); //retorna comments solo con PostId
});

Meteor.publish('notifications', function() {
  return Notifications.find();
});
