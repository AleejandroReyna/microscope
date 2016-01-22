Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); }, //recibimos usuario activo y post, verificamos si usuario activo es igual a creador
  remove: function(userId, post) { return ownsDocument(userId, post); }, //recibimos usuario activo y post, verificamos si usuario activo es igual a creador
});

Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

validatePost = function (post) { //declaramos una variable con una función
  var errors = {}; //creamos un objeto que contendrá los errores
  if (!post.title) //si no hay nada en el título
    errors.title = "Please fill in a headline"; //enviaremos el error al objeto
  if (!post.url) //si no hay nada en la url
    errors.url = "Please fill in a URL"; //enviaremos el error al objeto
  return errors; //retornamos el objeto
}

Meteor.methods({ //Ajustamos los eventos de meteor
  postInsert: function(postAttributes) { //Creamos el método postInsert
    check(this.userId, String); //Verificamos que el userId sea tipo string
    check(postAttributes, {
      title: String, //verifica que title = String
      url: String //verifica que url = String
    });

    var errors = validatePost(postAttributes);
    if (errors.title || errors.url) {
      throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");
    }

    var postWithSameLink = Posts.findOne({url: postAttributes.url}); //buscaremos si ya existe un post con la misma url y de ser así lo guardaremos en una variable
    if (postWithSameLink) { //si la url se encuentra en otro post enviaremos en la función
      return {
        postExists: true, //que el post existe
        _id: postWithSameLink._id //El id de ese post para evitar duplicados
      }
    }

    var user = Meteor.user(); //toma el usuario en sesión
    var post = _.extend(postAttributes, {//utilizamos extend para modificar datos de un objeto con datos de otro objeto
      userId: user._id, //Asignamos el Id del usuario owner del post
      author: user.username, //asignamos su username
      submitted: new Date() //asignamos su fecha de creación
    });

    var postId = Posts.insert(post); //establecemos en una variable la función de postear en la base de datos

    return {
      _id: postId //retorna el id del post para ser visualizado
    };
  },

  postEdit: function(postId, postAttributes) {
    check(postId, String);
    check(postAttributes, {
      title: String,
      url: String
    });

    var postWithSameLink = Posts.findOne({_id: { $ne: postId }, url: postAttributes.url});
    if (postWithSameLink) { //si la url se encuentra en otro post enviaremos en la función
      return {
        urlDuplicated: true, //que el post existe
        _id: postWithSameLink._id //El id de ese post para evitar duplicados
      }
    }

    var post = postAttributes;

    if (post.last_updated) {
      post.last_updated = new Date();
    } else {
      post = _.extend(postAttributes, {
        last_updated: new Date(),
      });
    };

    var postId = Posts.update(postId, {$set: post});

    return {
      _id: postId
    }
  }
});
