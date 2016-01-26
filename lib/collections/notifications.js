Notifications = new Mongo.collection('notifications');

Notifications.allow({ //permitirá
  update: function(userId, doc, fieldNames) { //el update si
    return ownsDocument(userId, doc) && //el usuario activo es el dueño de la notificación y
      fieldNames.length === 1 && fieldNames[0] === 'read'; //la notificación existe y si ha sido leído
  }
});

createCommentNotification = function(comment) { //creará la notificación del comentario
  var post = Posts.findOne(comment.postId); //colocará en la variable post el post al cual pertenece el comentario
  if (comment.userId !== post.userId) { //compara que el creador del comentario sea distinto al creador del post
    Notifications.insert({ //Insertará el la colección el objeto con:
      userId: post.userId, //el usuario creador del post
      postId: post._id, //el post comentado
      commentId: comment._id, //el id del comment
      commenterName: comment.author, //el autor del comentario
      read: false //muestra si ha sido leído, por defecto será falso
    });
  }
};
