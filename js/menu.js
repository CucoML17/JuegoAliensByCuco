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
    ostNivel.play();
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
