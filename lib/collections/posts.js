Posts = new Mongo.Collection('posts');

Meteor.methods({ //Ajustamos los eventos de meteor
  postInsert: function(postAttributes) { //Creamos el método postInsert
    check(Meteor.userId(), String); //Verificamos que el userId sea tipo string
    check(postAttributes, {
      title: String, //verifica que title = String
      url: String //verifica que url = String
    });

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
