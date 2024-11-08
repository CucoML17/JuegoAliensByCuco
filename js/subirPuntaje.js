import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


let puntTempo;


const params = new URLSearchParams(window.location.search);
const encodedData = params.get("data");

if (encodedData) {
    
    const decodedData = JSON.parse(atob(encodedData));

    
    puntTempo = decodedData.tempus;
 

    
}


document.getElementById("puntoso").innerHTML = "Tu tiempo en matar al jefe fue: "+ puntTempo +"";





document.getElementById("enviare").addEventListener("click", async (e) => {
    e.preventDefault(); 

    
    const boton = e.target;
    boton.disabled = true;

    
    const nombreJugador = document.getElementById("nombreJugador").value;
    const puntaje = puntTempo; 

    
    if (nombreJugador && puntaje) {
        try {
            
            const docRef = await addDoc(collection(db, "laderboards"), {
                nombre: nombreJugador,
                puntaje: puntaje
            });

            console.log("Documento escrito con ID: ", docRef.id);
            
            
            mostrarModal_aceptar();

        } catch (e) {
            console.error("Error al añadir el documento: ", e);
            alert("Hubo un error al enviar los datos.");
        }
    } else {
        alert("Por favor, completa los campos antes de enviar.");
    }

    
    
    
});





function mostrarModal_aceptar() {
    document.getElementById("modal_aceptar").style.display = "block";
}


function ocultarModal_aceptar() {
    document.getElementById("modal_aceptar").style.display = "none";
    location.replace("index.html");
}


document.querySelector(".close_aceptar").addEventListener("click", ocultarModal_aceptar);
document.getElementById("boton_volver_aceptar").addEventListener("click", ocultarModal_aceptar);


window.onclick = function(event) {
    const modal = document.getElementById("modal_aceptar");
    if (event.target === modal) {
        ocultarModal_aceptar();
    }
};
