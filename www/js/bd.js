$(document).ready(function () {

	// variables globales
        var db;
        var shortName = 'WebSqlDB';
        var version = '1.0';
        var displayName = 'WebSqlDB';
        var maxSize = 65535;

        onBodyLoad();
         
        //esto se llama cuando un error ocurre en una transacción
        function errorHandler(transaction, error) {
           alert('Error: ' + error.message + ' code: ' + error.code);
         
        }
         
        //esto se llama cuando ocurre una transacción exitosa
        function successCallBack() {
           //alert("DEBUGGING: success");
         
        }
         
        function nullHandler(){};
         
        //Se le llama cuando se carga la aplicación
        function onBodyLoad(){
             if (!window.openDatabase) {
               // No todos los dispositivos móviles compatibles con las bases de datos si no, la siguiente alerta mostrará lo que indica que el dispositivo no será albe para ejecutar esta aplicación
               alert('Las bases de datos no son compatibles con este navegador.');
               return;
             }
             
             db = openDatabase(shortName, version, displayName,maxSize);

             db.transaction(function(tx){
             
              //puede descomentar la siguiente línea si desea que la tabla de usuario que se vacía cada vez que la aplicación se ejecuta
              // tx.executeSql( 'DROP TABLE User',nullHandler,nullHandler);
             
               tx.executeSql( 'CREATE TABLE IF NOT EXISTS User(UserId INTEGER NOT NULL PRIMARY KEY, FirstName TEXT NOT NULL, LastName TEXT NOT NULL)', [],nullHandler,errorHandler);
             },errorHandler,successCallBack);
         
        }
        
        function ListDBValues() {
         
            if (!window.openDatabase) {
              alert('Databases are not supported in this browser.');
              return;
            }
            
            $('#lbUsers').html('');
             
            // la siguiente sección se seleccione todo el contenido de la tabla de usuario y luego ir a través de él fila por fila añadiendo la identificación de usuario Nombre Apellido al elemento # lbUsers en la página
            db.transaction(function(transaction) {
               transaction.executeSql('SELECT * FROM User;', [],
                 function(transaction, result) {
                  if (result != null && result.rows != null) {
                    for (var i = 0; i < result.rows.length; i++) {
                      var row = result.rows.item(i);
                      $('#lbUsers').append('<br>' + row.UserId + '. ' +row.FirstName+ ' ' + row.LastName);
                    }
                  }
                 },errorHandler);
            },errorHandler,nullHandler);
             
            return;
         
        }
        
        function agregarItem(){
         
            if (!window.openDatabase) {
                alert('Databases are not supported in this browser.');
                return;
            }
         
            // esta es la sección que en realidad inserta los valores en la tabla de usuario
            db.transaction(function(transaction) {
               transaction.executeSql('INSERT INTO User(FirstName, LastName) VALUES (?,?)',[$('#nombre').val(), $('#apellido').val()], nullHandler,errorHandler);
               });
             
            // esto llama a la función que va a mostrar lo que está en la tabla de usuario en la base de datos
            ListDBValues();
             
            return false;
         
        }

        function editarItem() {
         
          if (!window.openDatabase) {
            alert('Navegador no soporta base de datos');
            return;
          }
         
         	var q = "UPDATE User SET FirstName = '"+$('#nombre').val()+"', LastName='"+$('#apellido').val()+"' WHERE UserId ="+$('#id').val();
          db.transaction(function(transaction) {
            transaction.executeSql(q,[], nullHandler,errorHandler);
          });

          ListDBValues();
             
          return false;
         
        }

        function seleccionarItem() {
         
          if (!window.openDatabase) {
            alert('Navegador no soporta base de datos');
            return;
          }
         
          var q = "SELECT * FROM User WHERE UserId ="+$('#idu').val();
          
          db.transaction(function(transaction) {
               transaction.executeSql(q, [],
                 function(transaction, result) {
                  if (result != null && result.rows.length >0) {
                    var row = result.rows.item(0);
                    document.getElementById('nombreu').value = row.FirstName;
                    document.getElementById('apellidou').value = row.LastName;
                    //$('#lbUsers').append('<br>' + row.UserId + '. ' +row.FirstName+ ' ' + row.LastName);
                  }else{
                    alert("id incorrecto")
                  }
                 },errorHandler);
            },errorHandler,nullHandler);

          return false;
         
        }

    $("body").on('click', '#add', function(e){
			agregarItem();
		});

		$("body").on('click', '#edit', function(e){
			editarItem();
		});

    $("body").on('click', '#selec', function(e){
      seleccionarItem();
    });

		$("body").on('click', '#list', function(e){
			ListDBValues();
		});

});
