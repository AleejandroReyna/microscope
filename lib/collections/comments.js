Comments = new Mongo.Collection('comments');

Meteor.methods({ //establece los métodos para la collección
  commentInsert: function(commentAttributes) { //crea el método comment insert
    check(this.userId, String); //checa que el userId sea string
    check(commentAttributes, { //también recibe commentAttributes y chequea qué
      postId: String, //postId sea string
      body: String //body sea string
    });

    var user = Meteor.user(); //Guarda el usuario que ejecuta el método en una variable
    var post = Posts.findOne(commentAttributes.postId); //encuentra el post con el id enviado en ell call

    if (!post) //si no hay nada en post?
      throw new Meteor.Error('invalid-comment', 'You must comment on a post'); //genera un error

    comment = _.extend(commentAttributes, { //extend se utiliza para extender los elementos de un objeto con las propiedades de otro
      userId: user._id, //el id del usuario que creó el comentario
      author: user.username, //el nombre de usuario de este
      submitted: new Date() //genera una fecha en ese momento y la guarda para especificar cuando fue el comentario
    });

    Posts.update(comment.postId, {$inc: {commentsCount: 1}});  //incrementará el número contenido en commentsCount con 1

    comment._id = Comments.insert(comment); //Crea el comentario, y en el objeto comment, en su propiedad _id toma el callback de esta función

    createCommentNotification(comment); //llama al método para crear la notificación

    return comment._id; //retorna el id del comentario creado
  }
})
