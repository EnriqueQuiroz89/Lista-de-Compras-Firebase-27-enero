console.log("Agregado");

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyC7IxVax8cZ5eLwEhlHE5leNVlX7TBUIQ0",
    authDomain: "firestorecrud-f8226.firebaseapp.com",
    projectId: "firestorecrud-f8226",
});

var db = firebase.firestore();

// Agregar documentos
function guardar() {
    //Tres varaibles para la tarea
    var articulo = document.getElementById('articulo').value;
    var cantidad = document.getElementById('cantidad').value;
    var nota = document.getElementById('nota').value;

    db.collection("compras").add({
        articulo: articulo,
        cantidad: cantidad,
        nota: nota
    })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);

            document.getElementById('articulo').value = '';
            document.getElementById('cantidad').value = '';
            document.getElementById('nota').value = '';
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

// Creamos una var de donde queremos pintar la tabla
var table = document.getElementById('table');

// LEER Documentos

//  UPDATE en Tiempo Real
/** Cambios 
 * Remplaza get()  por onSnapshot()
 * Se Elimina .get().then((querySnapshot)...) y queda .onSnapshot((querySnapshot)...) 
 */

db.collection("compras").onSnapshot((querySnapshot) => {
    table.innerHTML = "";
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().born}`);
        table.innerHTML += `<tr">
        <td>${doc.data().articulo}</td>
        <td>${doc.data().cantidad}</td>
        <td>${doc.data().nota}</td>
        </tr>
        <tr>
        <td></td>
        <td><button class="btn btn-warning" onclick="editar('${doc.id}','${doc.data().articulo}','${doc.data().cantidad}','${doc.data().nota}')">Editar</button></td>
        <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
        </tr>`
    });
});

// BORRAR documentos
function eliminar(id) {
    db.collection("compras").doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

// EDITAR documento
function editar(id, articulo, cantidad, nota) {
    // Escribe en los campos los valores del renglon seleccionado
    document.getElementById('articulo').value = articulo;
    document.getElementById('cantidad').value = cantidad;
    document.getElementById('nota').value = nota;
    var boton = document.getElementById('boton');
    // Reemplaza "GUARDAR" por "EDITAR" en hot
    boton.innerHTML = 'Guardar cambios';

    // Crea una funcion anonima para ejecutar cuando se haga click
    boton.onclick = function () {
        // El ID no va a cambiar
        var compraRef = db.collection("compras").doc(id);
        // Capturar los cambios en los Textfield si los hubo
        var articuloEditado = document.getElementById('articulo').value;
        var cantidadEditada = document.getElementById('cantidad').value;
        var notaEditada = document.getElementById('nota').value;

        // realiza la actualizacion
        return compraRef.update({
            articulo: articuloEditado,
            cantidad: cantidadEditada,
            nota: notaEditada
        })
            .then(() => {
                console.log("Document successfully updated!");
                // Si exito Regresa al boton su nombre original "Guardar"
                boton.innerHTML = 'Agregar a la lista';
                // Limpia los campos
                document.getElementById('articulo').value = '';
                document.getElementById('cantidad').value = '';
                document.getElementById('nota').value = '';
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }

}


