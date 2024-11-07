import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


const canvas = document.getElementById('miCanvas');
const ctx = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const rutasPlanetas = [
    'img/menu/jupiter.png',
    'img/menu/mercury.png',
    'img/menu/saturne.png',
    'img/menu/neptunus.png',
    'img/menu/terra.png',
    'img/menu/urano.png',
    'img/menu/venus.png'
];


const imagenesPlanetas = [];
const posicionesPlanetas = []; 
const numEstrellas = 50; 


const ostNivel = new Audio('mp3/menu.mp3');

function cargarImagenes() {

    let imagenesCargadas = 0;

    rutasPlanetas.forEach((ruta, index) => {
        const imagenPlaneta = new Image();
        imagenPlaneta.src = ruta;

        imagenPlaneta.onload = () => {
            imagenesPlanetas[index] = imagenPlaneta; 
            imagenesCargadas++;

            
            if (imagenesCargadas === rutasPlanetas.length) {
                dibujarMenu();
            }
        };

        imagenPlaneta.onerror = () => {
            console.error(`Error al cargar la imagen: ${ruta}`); 
        };
    });
}


function generarPosicion() {
    const ancho = 100; 
    const alto = 100;  
    const x = Math.random() * (canvas.width - ancho); 
    const y = Math.random() * (canvas.height - alto); 
    return { x, y, ancho, alto };
}


function colisiona(nuevaPosicion) {
    return posicionesPlanetas.some(pos => {
        return (
            nuevaPosicion.x < pos.x + pos.ancho &&
            nuevaPosicion.x + nuevaPosicion.ancho > pos.x &&
            nuevaPosicion.y < pos.y + pos.alto &&
            nuevaPosicion.y + nuevaPosicion.alto > pos.y
        );
    });
}


function dibujarEstrellas() {
    for (let i = 0; i < numEstrellas; i++) {
        const x = Math.random() * canvas.width; 
        const y = Math.random() * canvas.height; 
        const radio = Math.random() * 2 + 1; 

        ctx.fillStyle = 'white'; 
        ctx.beginPath();
        ctx.arc(x, y, radio, 0, Math.PI * 2); 
        ctx.fill();
    }
}


function dibujarMenu() {
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    dibujarEstrellas();

    
    imagenesPlanetas.forEach(imagen => {
        let nuevaPosicion;
        do {
            nuevaPosicion = generarPosicion();
        } while (colisiona(nuevaPosicion));

        
        posicionesPlanetas.push(nuevaPosicion);

        
        ctx.drawImage(imagen, nuevaPosicion.x, nuevaPosicion.y, nuevaPosicion.ancho, nuevaPosicion.alto);
    });
}


cargarImagenes();



//MOdaloso




const modal = document.getElementById("modalComoJugar");
const botonComoJugar = document.getElementById("comoJugar");
const spanClose = document.querySelector(".close");


botonComoJugar.onclick = function() {
    modal.style.display = "block";
}


spanClose.onclick = function() {
    modal.style.display = "none";
}


window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



document.getElementById("jugar").addEventListener("click", function() {
    
    window.location.href = "nv1.html";
});












document.getElementById("selecNivel").addEventListener("click", function() {
    // Cambiamos el 'display' del overlay a 'flex' para mostrar el modal
    document.getElementById("modalOverlay_selNv").style.display = "flex";
});

// Opción para cerrar el modal al hacer clic fuera del contenido del modal
document.getElementById("modalOverlay_selNv").addEventListener("click", function(event) {
    // Solo cerramos el modal si se hace clic en el overlay, no en el contenido
    if (event.target === this) {
        this.style.display = "none";
    }
});




//EVENTOS BOTONES

// Seleccionar los botones por sus IDs
const btnNv1 = document.getElementById("btnNv1");
const btnNv2 = document.getElementById("btnNv2");
const btnNv3 = document.getElementById("btnNv3");

// Asignar eventos de clic a cada botón
btnNv1.addEventListener("click", function() {
    // Acción para el botón de Nivel 1
    window.location.href = "nv1.html";
    // Aquí puedes agregar tu lógica
});

btnNv2.addEventListener("click", function() {
    const data = {
        dinero: 0,
        vida: 5,
        numBalas: 3,
        velRecarga: 500,
        mejorRecar: 0,
        rafa: 0,
        nvAct: 2
    };

    const encodedData = btoa(JSON.stringify(data));

    // Redirigir a la nueva URL con los datos encriptados
    const url = `nivel2.html?data=${encodedData}`;
    window.location.href = url;

    // const url = `nivel2.html?dinero=0&vida=5&numBalas=3&velRecarga=500&mejorRecar=0&rafa=0&nvAct=2`;

    // window.location.href = url; // Redirigir al siguiente nivel con parámetros
});

btnNv3.addEventListener("click", function() {

    const data = {
        dinero: 0,
        vida: 5,
        numBalas: 3,
        velRecarga: 500,
        mejorRecar: 0,
        rafa: 0,
        nvAct: 3
    };

    const encodedData = btoa(JSON.stringify(data));

    // Redirigir a la nueva URL con los datos encriptados
    const url = `boss1.html?data=${encodedData}`;
    window.location.href = url;


});








document.getElementById("btnPuntajes").addEventListener("click", mostrarPuntaje);

function mostrarPuntaje() {
    // Llamar a Firebase para obtener la colección "leaderboards"
    const leaderboardRef = collection(db, "laderboards");

    // Obtener los documentos de la colección
    getDocs(leaderboardRef)
        .then((querySnapshot) => {
            // Crear un array para almacenar los resultados
            let puntajes = [];

            // Recorrer los documentos obtenidos
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const nombre = data.nombre;
                const puntaje = data.puntaje; // Formato "hh:mm:ss"

                // Convertir el tiempo a total de segundos para ordenar
                const tiempoEnSegundos = convertirATotalSegundos(puntaje);

                // Almacenar los datos en el array
                puntajes.push({ nombre, puntaje, tiempoEnSegundos });
            });

            // Ordenar los puntajes de menor a mayor por el tiempo
            puntajes.sort((a, b) => a.tiempoEnSegundos - b.tiempoEnSegundos);

            // Llamar a la función que muestra el modal
            mostrarModal_listaPunta();

            // Llamar a la función para mostrar los puntajes ordenados
            mostrarDatosEnTabla(puntajes);
        })
        .catch((error) => {
            console.log("Error al obtener los documentos: ", error);
        });
}

function convertirATotalSegundos(puntaje) {
    // Convertir el puntaje "hh:mm:ss" en total de segundos
    const partes = puntaje.split(":");
    const horas = parseInt(partes[0]);
    const minutos = parseInt(partes[1]);
    const segundos = parseInt(partes[2]);
    
    // Devolver el tiempo total en segundos
    return horas * 3600 + minutos * 60 + segundos;
}

function mostrarDatosEnTabla(puntajes) {
    const tbody = document.querySelector(".tabla_listaPunta tbody");

    // Limpiar el tbody antes de agregar los nuevos datos
    tbody.innerHTML = "";

    // Agregar las filas con los puntajes ordenados
    puntajes.forEach((p) => {
        const tr = document.createElement("tr");

        // Crear las celdas para el nombre y el puntaje
        const tdNombre = document.createElement("td");
        tdNombre.textContent = p.nombre;

        const tdPuntaje = document.createElement("td");
        tdPuntaje.textContent = p.puntaje;

        // Agregar las celdas a la fila
        tr.appendChild(tdNombre);
        tr.appendChild(tdPuntaje);

        // Agregar la fila al tbody
        tbody.appendChild(tr);
    });
}



// Obtener el botón de cerrar y el modal
const btnCerrar = document.getElementById("btnCerrar");
const modalOverlay = document.getElementById("modalOverlay_selNv");

// Evento de clic para cerrar el modal
btnCerrar.addEventListener("click", () => {
    modalOverlay.style.display = "none"; // Ocultar el modal
});
