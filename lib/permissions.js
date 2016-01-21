ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId; //Esta función retorna true o false si usuario = dueño del post
}
