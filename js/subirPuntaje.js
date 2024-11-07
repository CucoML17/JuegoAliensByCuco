import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


let puntTempo;


const params = new URLSearchParams(window.location.search);
const encodedData = params.get("data");

if (encodedData) {
    // Decodificar el Base64 a JSON
    const decodedData = JSON.parse(atob(encodedData));

    // Ahora puedes acceder a los datos
    puntTempo = decodedData.tempus;
 

    // Usa los datos como necesites
}


document.getElementById("puntoso").innerHTML = "Tu tiempo en matar al jefe fue: "+ puntTempo +"";





document.getElementById("enviare").addEventListener("click", async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener el botón y deshabilitarlo
    const boton = e.target;
    boton.disabled = true;

    // Obtener los valores del formulario
    const nombreJugador = document.getElementById("nombreJugador").value;
    const puntaje = puntTempo; // Suponiendo que "puntTempo" es la variable global con el puntaje

    // Verificar si los valores son válidos
    if (nombreJugador && puntaje) {
        try {
            // Acceder a la colección "laderboards" y agregar un nuevo documento
            const docRef = await addDoc(collection(db, "laderboards"), {
                nombre: nombreJugador,
                puntaje: puntaje
            });

            console.log("Documento escrito con ID: ", docRef.id);
            
            // Mostrar el modal de éxito
            mostrarModal_aceptar();

        } catch (e) {
            console.error("Error al añadir el documento: ", e);
            alert("Hubo un error al enviar los datos.");
        }
    } else {
        alert("Por favor, completa los campos antes de enviar.");
    }

    // Volver a habilitar el botón después de procesar (opcional)
    // Si deseas que el botón se habilite nuevamente después de un cierto tiempo o proceso, descomenta la siguiente línea
    // boton.disabled = false;
});




// Función para mostrar el modal
function mostrarModal_aceptar() {
    document.getElementById("modal_aceptar").style.display = "block";
}

// Función para ocultar el modal
function ocultarModal_aceptar() {
    document.getElementById("modal_aceptar").style.display = "none";
    location.replace("index.html");
}

// Eventos para cerrar el modal
document.querySelector(".close_aceptar").addEventListener("click", ocultarModal_aceptar);
document.getElementById("boton_volver_aceptar").addEventListener("click", ocultarModal_aceptar);

// Cerrar el modal al hacer clic fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById("modal_aceptar");
    if (event.target === modal) {
        ocultarModal_aceptar();
    }
};
