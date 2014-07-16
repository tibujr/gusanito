$(document).on("ready", ini);
var db;

function ini()
{
	//Agrego evento clic al boton para agregar registros
	$("#add").on("click",addAlumno);
	$("#del").on("click",menuDel);
	$("#btnEliminar").on("click",eliminarAlumno);
	$("#all").on("click",eliminarAll);

	//hago open a la base de datos
	db = openDatabase("DB-Alumnos","0.1","Alumos registrados", 200000);

	//pregunto si la base de datos se abrio
	if(db)
	{
		//inicio una transaccion para crear la tabla SOLO si NO exite
		db.transaction(function(tx){
			tx.executeSql("CREATE TABLE IF NOT EXISTS tblAlumnos(id integer primery key autoincrement, nombre text, edad integer)");
		});
	}
	else
	{
		alert("Error abriendo la base de datos!!")
	}

	consultarAlumnos();
}

function consultarAlumnos()
{
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM tblAlumnos", [],
			function(tx, result){
				var output = [];
				for(var i=0; i<result.rows.length; i++)
				{
					output.push([result.rows.item(i)['id'],
						result.rows.item(i)['nombre'],
						result.rows.item(i)['edad']]);
				}
				mostrarAlumnos(output);
			})
	});
}

function mostrarAlumnos(datos)
{
	if(datos.length > 0)
	{
		//Si hay datos en la consulta
		var item = "<table border='1' width='80%' align='center'>";
		item += "<tr>";
		item += "<td>Id</td><td>Nombre</td><td>Edad</td>";
		item += "</tr>";

		$("#listado").text(" ");
		//Recorro los datos para generar la estructura HTML
		for(var j=0; j<datos.length; j++)
		{
			item += "<tr>";
			item += "<td>"+datos[j][0]+"</td><td>"+datos[j][1]+"</td><td>"+datos[j][2]+"</td>";
			item += "</tr>";
		}
		item += "</table>";
		$("#listado").append(item);
	}
	else
	{
		//No hay datos en la consulta
		$("#listado").text("No hay registros en la base de datos");
	}
}

function addAlumno()
{
	var myNom = $("#nom").val();
	var myEdad = $("#ed").val();
	var sw = true;
	if(myNom=="")
	{
		alert("Ingrese el Nombre para hacer el registro");
		sw=false;
	}

	if(myEdad=="")
	{
		alert("Ingrese la edad para hacer el Registro");
		sw=false;
	}

	if(sw)
	{
		db.transaction(function(tx){
			tx.executeSql("INSERT INTO tblAlumnos(nombre,edad) VALUES(?,?)",[myNom,myEdad]);
			consultarAlumnos();
		});
	}
}

function menuDel()
{
	$("#fondo-pop, #pop-elimina").fadeIn("slow");
}

function eliminarAlumno()
{
	var myId = $("#idDel").val();
	if(myId=="")
	{
		alert("Por favor ingrese el id a Eliminar");
	}
	else
	{
		db.transaction(function(tx){
			tx.executeSql("DELETE FROM tblAlumnos WHERE id=?",[myId]);
		});
	}

	consultarAlumnos();

	$("#fondo-pop, #pop-elimina").fadeOut("slow");
}

function eliminarAll()
{
	db.transaction(function(tx){
		tx.executeSql("DELETE FROM tblAlumnos");
	});

	db.transaction(function(tx){
		tx.executeSql("UPDATE sqlite_sequence SET seq=0");
	});

	consultarAlumnos();
	alert("Se Eliminaron correctamente todos los registros!!")
}