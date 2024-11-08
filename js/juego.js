let fps;
let frameTimes = [];

function calcularFPS() {
    let tiempoActual = performance.now();

    if (frameTimes.length > 0) {
        
        let tiempoEntreFrames = tiempoActual - frameTimes[frameTimes.length - 1];
        fps = 1000 / tiempoEntreFrames; 
    }

    frameTimes.push(tiempoActual);

    if (frameTimes.length > 60) {
        
        frameTimes.shift();
    }

    
    //console.log(`FPS: ${Math.round(fps)}`);

    
    requestAnimationFrame(calcularFPS);
}


calcularFPS();






let factorVel = 1;

function ajustarVelocidad() {
   
    if (fps < 30) { 
        factorVel = 1.5;
        //console.log("Hmm1");
    } else if (fps >= 100) { 
        factorVel = 0.7;
        //console.log("Hmm2");
    } else {
        factorVel = 1; 
        //console.log("Hmm3");
    }
}


setInterval(ajustarVelocidad, 1000); 





//Los hilos tipo processing
const sonidoFinJuego = new Audio('mp3/fin.mp3'); 
const imagenNaveFinal = new Image();
imagenNaveFinal.src = 'img/explosion.png'; 
const imagenFinJuego = new Image();
imagenFinJuego.src = 'img/skill.png'; 
let juegoEnPausa = false; 

let gameOver=false;

let dX = canvas.width;
let dY = canvas.height;


window.addEventListener('resize', ajustarCanvas);
ajustarCanvas()

const imagenNave = new Image();
imagenNave.src = "img/nave.png"; 

const imagenNaveDolor = new Image();
imagenNaveDolor.src = "img/explosion.png";

function dibujarNave() {
    
    if (imagenNave.complete) {
        ctx.drawImage(imagenNave, nave.x, nave.y, nave.width, nave.height); 
    } else {
        
        imagenNave.onload = () => {
            ctx.drawImage(imagenNave, nave.x, nave.y, nave.width, nave.height);
        };
    }
}

function dibujarNaveMuerte() {
    
    if (imagenNaveDolor.complete) {
        ctx.drawImage(imagenNaveDolor, nave.x, nave.y, nave.width, nave.height); 
    } else {
        
        imagenNaveDolor.onload = () => {
            ctx.drawImage(imagenNaveDolor, nave.x, nave.y, nave.width, nave.height);
        };
    }
}


const nave = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 70,
    width: 60,
    height: 60,
    speed: 5 * factorVel 
};


let tempSpawn1 = 6000; 
let tempBaja1 = 2000; 
let velocidadEnemigo = 0.7; 



function dibujarPuntaje() {
    ctx.font = '26px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Puntaje: ${puntaje}`, 10, 30);
    ctx.font = '16px Arial';
    ctx.fillText(`Puntaje necesario: 100`, 10, 60);
}



//FIN VIDA


//MODAL GANASTE

function abrirModalFin() {
    const overlay = document.getElementById('modalOverlayFin');
    const content = document.getElementById('modalContentFin');
    
    
    if (overlay && content) {
        overlay.classList.add('show');   
        content.classList.add('show');   
    } else {
        console.error('No se pudo encontrar el modal o su contenido.');
    }
}




function ocultarModalFin() {
    const overlay = document.getElementById('modalOverlayFin');
    const content = document.getElementById('modalContentFin');
    
    content.classList.remove('show'); 
    overlay.classList.remove('show'); 

    setTimeout(() => {
        overlay.style.display = 'none'; 
    }, 500); 
}


function volverAlMenuFin() {
    console.log("Volver al menú presionado");
    ocultarModalFin();
    
    
    const boton = event.target; 

    if (boton.textContent === "Volver al menú") {
        window.location.href = "index.html"; 
    } 
}

function siguienteNivelFin() {
    console.log("Siguiente nivel presionado");
    ocultarModalFin();

    
    const boton = event.target; 

    if (boton.textContent === "Siguiente nivel") {
        const data = {
            dinero: dineroAct,
            vida: vida,
            numBalas: numMaxBalas,
            velRecarga: velRecarga,
            mejorRecar: mejorRecar,
            rafa: rafa,
            nvAct: 2
        };

        const encodedData = btoa(JSON.stringify(data));

        
        const url = `nivel2.html?data=${encodedData}`;
        window.location.href = url;
    }
}

//fin modal ganaste



//---BALAS---
let municion = 3; 
let numMaxBalas = 3; 
let velRecarga = 500; 

let intervaloRecarga; 

function recargarMunicion() {

    if (municion < numMaxBalas) {
        municion++;
    }
}
function iniciarRecarga() {
    
    if (intervaloRecarga) {
        clearInterval(intervaloRecarga);
    }

    
    intervaloRecarga = setInterval(recargarMunicion, velRecarga);
}
function cambiarVelRecarga(nuevaVel) {
    velRecarga = nuevaVel; 
    iniciarRecarga(); 
}


iniciarRecarga();


const imagenMunicion = new Image();
imagenMunicion.src = 'img/bullet.png'; 

function dibujarMunicion() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Munición', 10, canvas.height - 40); 

    for (let i = 0; i < municion; i++) {
        ctx.drawImage(imagenMunicion, 10 + i * 25, canvas.height - 30, 20, 20);
    }
}








function manejarTecla(event) {
    if (event.key === 'T' || event.key === 't') {
        if (gameOver == false && yaAcabo==false) {
            if (enTienda) {
                
                enTienda = false; 
                juegoEnPausa = false; 
                reanudarGeneradores(); 
                cerrarModal();
                requestAnimationFrame(actualizarJuego); 
            } else {
                
                enTienda = true; 
                juegoEnPausa = true; 
                pausarGeneradores(); 
                abrirModal();
                requestAnimationFrame(actualizarJuego); 
            }
        }
    } else if (event.key === 'z' && juegoEnPausa) {
        
        reiniciarJuego(event);
    }
}

window.addEventListener('keydown', manejarTecla);



canvas.addEventListener('mousemove', (event) => {
    if(gameOver==false && complet==false){
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    ctx.textAlign = 'left';
    dibujarNave();
    dibujarDisparos();
    dibujarEnemigos();
    dibujarPuntaje();
    dibujarVidas();
    dibujarMunicion(); 

    mostrarMenuTienda(mouseX, mouseY); 
    }
});


//Completado-------
let complet = false;
let opacidadFondo = 0; 
const imagenTitulo = new Image(); 
imagenTitulo.src = "img/nvComplete.png"; 
const botones = [
    { texto: "Volver al menú", x: 150+320, y: 350, ancho: 150, alto: 50 },
    { texto: "Siguiente nivel", x: 350+320, y: 350, ancho: 150, alto: 50 }
];
let yaAcabo = false;

function completado() {
    complet = true; 
    opacidadFondo = 0; 

    requestAnimationFrame(dibujarPantallaCompletado); 
}

function dibujarPantallaCompletado() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarNave();
    dibujarDisparos();
    dibujarEnemigos();
    dibujarPuntaje();
    dibujarVidas();
    dibujarMunicion();
    
    
    opacidadFondo = Math.min(opacidadFondo + 0.01, 1);

    
    ctx.fillStyle = `rgba(0, 0, 0, ${opacidadFondo})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    if (opacidadFondo >= 0.5) {
        ctx.globalAlpha = opacidadFondo;
        ctx.drawImage(imagenTitulo, (canvas.width - 750) / 2, 50, 750, 200);
        ctx.globalAlpha = 1; 
    }

    
    botones.forEach(boton => {
        
        ctx.fillStyle = "white";
        ctx.fillRect(boton.x, boton.y, boton.ancho, boton.alto);

        
        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(boton.texto, boton.x + boton.ancho / 2, boton.y + boton.alto / 2);
    });

    
    if (opacidadFondo < 1) {
        requestAnimationFrame(dibujarPantallaCompletado);
    }
}


canvas.addEventListener("click", (event) => {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    botones.forEach(boton => {
        
        if (
            mouseX >= boton.x &&
            mouseX <= boton.x + boton.ancho &&
            mouseY >= boton.y &&
            mouseY <= boton.y + boton.alto
        ) {
            if (boton.texto === "Volver al menú") {
         
                //window.location.href = "index.html";

            } else if (boton.texto === "Siguiente nivel") {
                //const url = `nivel2.html?dinero=${dineroAct}&vida=${vida}&numBalas=${numMaxBalas}&velRecarga=${velRecarga}&mejorRecar=${mejorRecar}&rafa=${rafa}&nvAct=2`;

                //window.location.href = url;
            }
        }
    });
});


//FIN Completado-----







const disparos = [];
let enemigos = [];


const imagenEnemigo = new Image();
imagenEnemigo.src = 'img/enemigo1.png'; 


const teclas = {};


const sonidoEliminacion = new Audio('mp3/bonk.mp3'); 


document.addEventListener('keydown', (event) => {
    teclas[event.key] = true;
});
document.addEventListener('keyup', (event) => {
    teclas[event.key] = false;
});


function moverNave() {
    
    if ((teclas['ArrowLeft'] || teclas['a'] || teclas['A']) && nave.x > 0) {
        nave.x -= nave.speed * factorVel;
    }
    
    if ((teclas['ArrowRight'] || teclas['d'] || teclas['D']) && nave.x + nave.width < canvas.width) {
        nave.x += nave.speed * factorVel;
    }
    
    if ((teclas[' '] || teclas['Enter']) && !teclas.shoot) {
        crearDisparo();
        teclas.shoot = true;
    }
    
    if (!teclas[' '] && !teclas['Enter']) {
        teclas.shoot = false;
    }
}



let rafa=0;
function crearDisparo() {
    
    if (municion > 0) { 
        for(i=0; i<=rafa;i++){
            const piu = new Audio('mp3/disparo.mp3'); 
            piu.play();

            disparos.push({ x: nave.x + nave.width / 2, y: nave.y-(i*10), radius: 5 });
        }
       
        municion--; 
    }
}



function moverDisparos() {
    disparos.forEach((disparo, index) => {
        disparo.y -= 7*factorVel;
        if (disparo.y < 0) disparos.splice(index, 1);
    });
}


function dibujarDisparos() {



    ctx.fillStyle = '#fff';
    disparos.forEach(disparo => {
        ctx.beginPath();
        ctx.arc(disparo.x, disparo.y, disparo.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}


function crearFilaEnemigos() {
    const tamaño = 50;
    const espacio = 20;
    const inicioX = Math.floor(Math.random() * (canvas.width - (6 * tamaño + 5 * espacio)));

    for (let i = 0; i < 5; i++) {
        const posicionX = inicioX + i * (tamaño + espacio);

        if (posicionX + tamaño <= canvas.width) {
            enemigos.push({
                x: posicionX,
                y: 0,
                width: tamaño,
                height: tamaño,
                eliminado: false 
            });
        }
    }
}




const sonidoPerdidaVida = new Audio('mp3/dolor.mp3'); 

function moverEnemigos() {
    enemigos.forEach((enemigo, index) => {
        enemigo.y += velocidadEnemigo*factorVel;

        
        if (enemigo.y > canvas.height) {
            enemigos.splice(index, 1);
            //sonidoPerdidaVida.play();
            const sonidoPerdidaVidaRep = new Audio('mp3/dolor.mp3'); 
            sonidoPerdidaVidaRep.play();
            vida--; 
            if (vida <= 0) {
                juegoEnPausa = true; 
                sonarFinJuego(); 
            }
        }
    });
}

const explosiones = [];

function detectarColision() {
    disparos.forEach((disparo, dIndex) => {
        enemigos.forEach((enemigo, eIndex) => {
            if (
                disparo.x > enemigo.x &&
                disparo.x < enemigo.x + enemigo.width &&
                disparo.y > enemigo.y &&
                disparo.y < enemigo.y + enemigo.height &&
                !enemigo.eliminado 
            ) {
                disparos.splice(dIndex, 1); 
                puntaje++;
                dineroAct++;

                
                explosiones.push({ x: enemigo.x, y: enemigo.y });

                const sonidoPerdidaVidaRep = new Audio('mp3/bonk.mp3'); 
                sonidoPerdidaVidaRep.play();

                
                enemigos.splice(eIndex, 1); 

                
                setTimeout(() => {
                    explosiones.splice(explosiones.findIndex(ex => ex.x === enemigo.x && ex.y === enemigo.y), 1);
                }, 1000);
            }
        });
    });

    
    enemigos.forEach((enemigo, eIndex) => {
        if (
            !enemigo.eliminado && 
            nave.x < enemigo.x + enemigo.width &&
            nave.x + nave.width > enemigo.x &&
            nave.y < enemigo.y + enemigo.height &&
            nave.y + nave.height > enemigo.y
        ) {
            enemigos.splice(eIndex, 1); 
            vida--;

            const sonidoPerdidaVidaRep = new Audio('mp3/dolor.mp3');
            sonidoPerdidaVidaRep.play();

            if (vida <= 0) {
                juegoEnPausa = true;
                sonarFinJuego();
            }
        }
    });
}

const imagenExplosion = new Image();
imagenExplosion.src = "img/explosion.png"; 


imagenExplosion.onload = () => {
    console.log("Imagen de explosión cargada correctamente");
};

function dibujarExplosiones() {
    explosiones.forEach(explosion => {
        ctx.drawImage(imagenExplosion, explosion.x, explosion.y, 50, 50); 
    });
}












function dibujarEnemigos() {
    enemigos.forEach(enemigo => {
        if (!enemigo.eliminado) { 
            const imagenEnemigo = new Image();
            imagenEnemigo.src = "img/enemigo1.png";
            ctx.drawImage(imagenEnemigo, enemigo.x, enemigo.y, enemigo.width, enemigo.height);
        }
    });
}




const morido = new Audio('mp3/morite.mp3');

function sonarFinJuego() {
    morido.play();
    sonidoFinJuego.play();
    juegoEnPausa = true; 
    gameOver = true;
    
    nave.img = imagenNaveFinal; 
}


function mostrarPantallaFin() {
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    const nuevaAltura = canvas.height * 0.8; 
    const proporcion = imagenFinJuego.width / imagenFinJuego.height; 
    const nuevaAnchura = nuevaAltura * proporcion; 

    
    const x = (canvas.width - nuevaAnchura) / 2;
    const y = (canvas.height - nuevaAltura) / 2;

    
    ctx.drawImage(imagenFinJuego, x, y, nuevaAnchura, nuevaAltura);

    
    ctx.fillStyle = 'white'; 
    ctx.font = '24px Arial'; 
    ctx.textAlign = 'center'; 
    ctx.fillText('Presiona Z para volver a jugar o X para salir', canvas.width / 2, canvas.height - 30); 

    
    window.addEventListener('keydown', reiniciarJuego);
}



function reiniciarJuego(event) {
    if (event.key === 'z' && juegoEnPausa) {
        location.reload(); 
    }
    if (event.key === 'x' && juegoEnPausa) {
        location.replace("index.html");
    }
}





let intervaloGenerarEnemigos; 
let intervaloMoverEnemigos; 


function iniciarGeneradores() {
    intervaloGenerarEnemigos = setInterval(crearFilaEnemigos, tempSpawn1);
    intervaloMoverEnemigos = setInterval(moverEnemigos, tempBaja1);
}


function pausarGeneradores() {
    clearInterval(intervaloGenerarEnemigos);
    clearInterval(intervaloMoverEnemigos);
}


function reanudarGeneradores() {
    iniciarGeneradores(); 
}


function cambiarTempSpawn(nuevoTemp) {
    tempSpawn1 = nuevoTemp; 
    pausarGeneradores(); 
    iniciarGeneradores(); 
}





const ostNivel = new Audio('mp3/nivel1.mp3');

let yaMas=false;

const danger = new Audio('mp3/danger.mp3');

function actualizarJuego() {
    ostNivel.play();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'left'; 

    
    if (puntaje >= 100 && !yaAcabo) {
        juegoEnPausa = true;
        yaAcabo = true;
        pausarGeneradores();
        //completado();

        dibujarNave();
        dibujarDisparos();
        dibujarEnemigos();
        dibujarPuntaje();
        dibujarVidas();
        dibujarMunicion();
        
        abrirModalFin();
    }

    if(yaMas==false && puntaje>50){
        console.log("Amuenta")
        yaMas=true;
        tempSpawn1=tempSpawn1-1000;
        cambiarTempSpawn(tempSpawn1);
        danger.play();

    }

    if (!juegoEnPausa && !complet) { 
        moverNave();
        moverDisparos();
        moverEnemigos();
        detectarColision();
        dibujarDinero();
    }

    dibujarNave();
    dibujarDisparos();
    dibujarEnemigos();
    dibujarExplosiones(); 
    dibujarPuntaje();
    dibujarVidas();
    dibujarMunicion();

    if (enTienda && !gameOver && !complet) {
        
        mostrarMenuTienda(); 
    } else if (gameOver) {
        dibujarNaveMuerte();
        mostrarPantallaFin(); 
        ostNivel.pause();
    } else if (!complet) {
        requestAnimationFrame(actualizarJuego); 
    }
}


iniciarGeneradores();
actualizarJuego();
