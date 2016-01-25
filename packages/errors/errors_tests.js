Tinytest.add("Errors - collection", function(test) { //asigna el nombre y la creación del test
  test.equal(Errors.collection.find({}).count(), 0); //plantea la primer condición

  Errors.throw('A new error!'); //crea un nuevo error
  test.equal(Errors.collection.find({}).count(), 1); //plantea la condición de haber creado el error en la base de datos local

  Errors.collection.remove({}); //remueve el error en el testing
});

Tinytest.addAsync("Errors - template", function(test, done) { //Creamos un test asíncrono
  Errors.throw('A new error!'); //Creamos el error
  test.equal(Errors.collection.find({}).count(), 1); //Verificamos que el error haya sido creado

  UI.insert(UI.render(Template.meteorErrors), document.body); //renderizamos el error

  Meteor.setTimeout(function() { //establecemos un setTimeout para verificar que el error ya no existe
    test.equal(Errors.collection.find({}).count(), 0); //verificamos que ya no exista el error
    done(); //completamos el test de esta manera
  }, 3500); //pasados los 3 segundos y medio
});
