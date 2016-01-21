Posts = new Mongo.Collection('posts');

Meteor.methods({ //Ajustamos los eventos de meteor
  postInsert: function(postAttributes) { //Creamos el método postInsert
    check(this.userId, String); //Verificamos que el userId sea tipo string
    check(postAttributes, {
      title: String, //verifica que title = String
      url: String //verifica que url = String
    });

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
  }
});
