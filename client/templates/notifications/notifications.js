Template.notifications.helpers({
  notifications: function() {
    return Notifications.find({userId: Meteor.userId(), read: false});
    //Retorna todas las notificaciones con el usuario loggeado que no han sido leídas
  },
  notificationCount: function(){
    return Notifications.find({userId: Meteor.userId(), read: false}).count();
    //retorna el total de las notificacion del usuario loggeado sin leer
  }
});

Template.notificationItem.helpers({
  notificationPostPath: function() {
    return Router.routes.postPage.path({_id: this.postId});
    //Retorna la ruta del router del postpage con el postId contenido en el objeto comment
  }
});

Template.notificationItem.events({
  'click a': function() {
    Notifications.update(this._id, {$set: {read: true}});
    //al click en notificación llamamos al método update, pasamos el id de la notificación y seteamos el atributo red en true
  }
});
