Template.postEdit.events({
  'submit form': function(e) { //Lo que sucede si submit form
    e.preventDefault(); //quita la verdadera acción del submit
    var currentPostId = this._id; //toma el id del post en acción
    var postProperties = {
      url: $(e.target).find('[name=url]').val(), //toma el valor url del post
      title: $(e.target).find('[name=title]').val() //toma el título del post
    }

    Meteor.call("postEdit", currentPostId, postProperties, function(error, result){
      if (error){
        return alert(error.reason);
      } else if (result.urlDuplicated) {
        return alert("url duplicated");
      } else {
        Router.go('postPage', {_id: result._id});
      }
    });

    //Posts.update(currentPostId, {$set: postProperties}, function(error) {
      //le enviamos el id para que sepa que post editar
      //$set los nuevos valores incluidos en la variable
      //function se ejecutará con el callback de update
    //  if (error) { //Si hay error
    //    alert(error.reason); //razón error
    //  } else {
    //    Router.go('postPage', {_id: currentPostId}); //Redirige al postpage con el id
    //  }
    //});
  },

  'click .delete': function(e) {
    e.preventDefault();
    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('postsList');
    }
  }
});
