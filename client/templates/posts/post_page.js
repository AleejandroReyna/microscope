Template.postPage.helpers({ //Helpers para el post page
  comments: function() { //establece el helper comments
    return Comments.find({postId: this._id}); //retorna los resultados de la tabla con el postID del post
  }
});
