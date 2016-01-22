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
        return throwError(error.reason);
      } else if (result.urlDuplicated) {
        return throwError("url duplicated");
      } else {
        Router.go('postPage', {_id: currentPostId});
      }
    });
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
