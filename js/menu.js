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
    
    document.getElementById("modalOverlay_selNv").style.display = "flex";
});


document.getElementById("modalOverlay_selNv").addEventListener("click", function(event) {
    
    if (event.target === this) {
        this.style.display = "none";
    }
});




//EVENTOS BOTONES


const btnNv1 = document.getElementById("btnNv1");
const btnNv2 = document.getElementById("btnNv2");
const btnNv3 = document.getElementById("btnNv3");


btnNv1.addEventListener("click", function() {
    
    window.location.href = "nv1.html";
    
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

    
    const url = `nivel2.html?data=${encodedData}`;
    window.location.href = url;

    

    
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

    
    const url = `boss1.html?data=${encodedData}`;
    window.location.href = url;


});








document.getElementById("btnPuntajes").addEventListener("click", mostrarPuntaje);

function mostrarPuntaje() {
    
    const leaderboardRef = collection(db, "laderboards");

    
    getDocs(leaderboardRef)
        .then((querySnapshot) => {
            
            let puntajes = [];

            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const nombre = data.nombre;
                const puntaje = data.puntaje; 

                
                const tiempoEnSegundos = convertirATotalSegundos(puntaje);

                
                puntajes.push({ nombre, puntaje, tiempoEnSegundos });
            });

            
            puntajes.sort((a, b) => a.tiempoEnSegundos - b.tiempoEnSegundos);

            
            mostrarModal_listaPunta();

            
            mostrarDatosEnTabla(puntajes);
        })
        .catch((error) => {
            console.log("Error al obtener los documentos: ", error);
        });
}

function convertirATotalSegundos(puntaje) {
    
    const partes = puntaje.split(":");
    const horas = parseInt(partes[0]);
    const minutos = parseInt(partes[1]);
    const segundos = parseInt(partes[2]);
    
    
    return horas * 3600 + minutos * 60 + segundos;
}

function mostrarDatosEnTabla(puntajes) {
    const tbody = document.querySelector(".tabla_listaPunta tbody");

    
    tbody.innerHTML = "";

    
    puntajes.forEach((p) => {
        const tr = document.createElement("tr");

        
        const tdNombre = document.createElement("td");
        tdNombre.textContent = p.nombre;

        const tdPuntaje = document.createElement("td");
        tdPuntaje.textContent = p.puntaje;

        
        tr.appendChild(tdNombre);
        tr.appendChild(tdPuntaje);

        
        tbody.appendChild(tr);
    });
}




const btnCerrar = document.getElementById("btnCerrar");
const modalOverlay = document.getElementById("modalOverlay_selNv");


btnCerrar.addEventListener("click", () => {
    modalOverlay.style.display = "none"; 
});
