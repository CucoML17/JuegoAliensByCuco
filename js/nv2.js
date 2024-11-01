let fps;
let frameTimes = [];

function calcularFPS() {
    let tiempoActual = performance.now();

    if (frameTimes.length > 0) {
        // Calcula el tiempo entre cuadros
        let tiempoEntreFrames = tiempoActual - frameTimes[frameTimes.length - 1];
        fps = 1000 / tiempoEntreFrames; // Convertir a FPS
    }

    frameTimes.push(tiempoActual);

    if (frameTimes.length > 60) {
        // Mantén solo los últimos 60 tiempos de cuadro
        frameTimes.shift();
    }

    // Imprimir los FPS en la consola
    //console.log(`FPS: ${Math.round(fps)}`);

    // Llama a esta función en el próximo cuadro
    requestAnimationFrame(calcularFPS);
}

// Iniciar el cálculo de FPS
calcularFPS();

// Iniciar el cálculo de FPS


// Puedes usar `fps` para ajustar la velocidad en función de la tasa de refresco

let factorVel = 1;

function ajustarVelocidad() {
   
    if (fps < 30) { // Si los FPS son bajos, ralentiza el juego
        factorVel = 1.5;
        //console.log("Hmm1");
    } else if (fps >= 100) { // Si los FPS son altos, ajusta la velocidad
        factorVel = 0.7;
        //console.log("Hmm2");
    } else {
        factorVel = 1; // FPS normales
        //console.log("Hmm3");
    }
}

// Llama a `ajustarVelocidad` regularmente para ajustar el factor de velocidad
setInterval(ajustarVelocidad, 1000); // Ajusta cada segundo


const params = new URLSearchParams(window.location.search);
const dineroActL = parseInt(params.get("dinero"));
const vidaL = parseInt(params.get("vida"));
const numMaxBalasL = parseInt(params.get("numBalas"));
const velRecargaL = parseInt(params.get("velRecarga"));
const mejorRecarL = parseInt(params.get("mejorRecar"));
const rafaL = parseInt(params.get("rafa"));

let tempBaja2 = 3000; 


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

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
    speed: 5*factorVel
};


let tempSpawn1 = 5000; 
let tempBaja1 = 2000; 
let velocidadEnemigo = 0.8; 


let puntaje = 0;
let dineroAct = dineroActL+100;
function dibujarPuntaje() {
    ctx.font = '26px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Puntaje: ${puntaje}`, 10, 30);
    ctx.font = '16px Arial';
    ctx.fillText(`Puntaje necesario: 200`, 10, 60);
}


let vida = vidaL;
const imagenVida = new Image();
imagenVida.src = 'img/cora.png'; 
function dibujarVidas() {
    ctx.font = '26px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Vida', canvas.width - 100, canvas.height - 60); 

    const espacioEntreVidas = 25; 
    const anchoVida = 20; 
    const maxVidasPorFila = 5; 
    let fila = 0; 

    for (let i = 0; i < vida; i++) {
        
        const x = canvas.width - 150 + (i % maxVidasPorFila) * espacioEntreVidas; 
        const y = canvas.height - 30 + fila * (anchoVida + 10); 

        
        if (i > 0 && i % maxVidasPorFila === 0) {
            fila++;
        }

        
        ctx.drawImage(imagenVida, x, y-20, anchoVida, anchoVida);
    }
}



//---BALAS---
let municion = 3; 
let numMaxBalas = numMaxBalasL; 
let velRecarga = velRecargaL; 

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





//TIENDA
let mejorRecar=mejorRecarL;
canvas.addEventListener('mousedown', manejarClick);

function manejarClick(event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    
    const botones = ["Munición", "Reparar", "Recarga", "Rafaga"];
    const espacioEntreBotones = 10;
    const anchoBoton = 100;
    const yBoton = 100;

    botones.forEach((texto, i) => {
        const x = (canvas.width - (anchoBoton * botones.length + espacioEntreBotones * (botones.length - 1))) / 2 + i * (anchoBoton + espacioEntreBotones);
        
        
        const estaSobreBoton = mouseX >= x && mouseX <= x + anchoBoton && mouseY >= yBoton && mouseY <= yBoton + 40;

        if (estaSobreBoton) {
            if (texto === "Munición") {
                
                if (dineroAct >= 50 && numMaxBalas < 6) {
                    dineroAct -= 50; 
                    numMaxBalas += 1; 
                    console.log("Compraste una mejora de munición");
                    ctx.fillStyle = 'yellow'; 
                    ctx.fillRect(10, 10, 150, 30); 
                
                    
                    ctx.fillStyle = 'black'; 
                    ctx.font = '16px Arial'; 
                    ctx.fillText("Dinero: $" + dineroAct, 15, 30);                    
                } else {
                    console.log("No tienes suficiente dinero o el máximo de balas ya se ha alcanzado.");
                }
            }
            if (texto === "Reparar") {
                
                if (dineroAct >= 25 && vida < 9) {
                    dineroAct -= 25; 
                    vida += 1; 
                    console.log("Compraste una mejora de munición");
                    ctx.fillStyle = 'yellow'; 
                    ctx.fillRect(10, 10, 150, 30); 
                
                    
                    ctx.fillStyle = 'black'; 
                    ctx.font = '16px Arial'; 
                    ctx.fillText("Dinero: $" + dineroAct, 15, 30);                    
                } else {
                    console.log("No tienes suficiente dinero o el máximo de balas ya se ha alcanzado.");
                }
            }      
            
            if (texto === "Recarga") {
                
                if (dineroAct >= 150 && mejorRecar < 3) {
                    dineroAct -= 150; 
                    mejorRecar++;
                    velRecarga=velRecarga-125;
                    cambiarVelRecarga(velRecarga)
                    console.log("Compraste una mejora de munición");
                    ctx.fillStyle = 'yellow'; 
                    ctx.fillRect(10, 10, 150, 30); 
                
                    
                    ctx.fillStyle = 'black'; 
                    ctx.font = '16px Arial'; 
                    ctx.fillText("Dinero: $" + dineroAct, 15, 30);                    
                } else {
                    console.log("No tienes suficiente dinero o el máximo de balas ya se ha alcanzado.");
                }
            }        
            
            if (texto === "Rafaga") {
                
                if (dineroAct >= 200 && rafa < 3) {
                    dineroAct -= 200; 
                    
                    rafa=rafa+1;
                    
                    console.log("Compraste una mejora de munición");
                    ctx.fillStyle = 'yellow'; 
                    ctx.fillRect(10, 10, 150, 30); 
                
                    
                    ctx.fillStyle = 'black'; 
                    ctx.font = '16px Arial'; 
                    ctx.fillText("Dinero: $" + dineroAct, 15, 30);                    
                } else {
                    console.log("No tienes suficiente dinero o el máximo de balas ya se ha alcanzado.");
                }
            }   
            
        }
    });
}


let enTienda = false; 

let botonSeleccionado = null; 
let textoAyuda = ""; 


function mostrarMenuTienda(mouseX, mouseY) {
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    ctx.fillStyle = 'yellow'; 
    ctx.fillRect(10, 10, 150, 30); 

    
    ctx.fillStyle = 'black'; 
    ctx.font = '16px Arial'; 
    ctx.fillText("Dinero: $" + dineroAct, 15, 30); 

    
    ctx.fillStyle = 'white'; 
    ctx.font = '24px Arial'; 
    ctx.textAlign = 'center'; 
    ctx.fillText("~ Tienda los sueños rotos de Cuco ~", canvas.width / 2, 50); 

    
    const botones = ["Munición", "Reparar", "Recarga", "Rafaga"];
    const espacioEntreBotones = 10;
    const anchoBoton = 100;
    const yBoton = 100;

    botones.forEach((texto, i) => {
        const x = (canvas.width - (anchoBoton * botones.length + espacioEntreBotones * (botones.length - 1))) / 2 + i * (anchoBoton + espacioEntreBotones);
        
        
        const estaSobreBoton = mouseX >= x && mouseX <= x + anchoBoton && mouseY >= yBoton && mouseY <= yBoton + 40;

        if (estaSobreBoton) {
            ctx.fillStyle = 'lightgray'; 
            botonSeleccionado = texto; 
            if(texto==="Munición"){
                textoAyuda="Aumenta la capacidad de munición (máximo 6). Cuesta $50";
            }
            if(texto==="Reparar"){
                textoAyuda="Recupera un corazón a la nave (máximo 9). Cuesta $25";
            }
            
            if(texto==="Recarga"){
                textoAyuda="Aumenta tu velocidad de recarga en un 25% (máximo 3 compras). Cuesta $150";
            }
            
            if(texto==="Rafaga"){
                textoAyuda="Doble tiro! mata dos bichos de un tiro. Cuesta $200";
            }            
        } else {
            ctx.fillStyle = 'white'; 
        }

        ctx.fillRect(x, yBoton, anchoBoton, 40); 
        ctx.fillStyle = 'black'; 
        ctx.fillText(texto, x + anchoBoton / 2, yBoton + 25); 
    });

    
    if (botonSeleccionado) {
        ctx.fillStyle = 'white'; 
        ctx.fillRect(canvas.width / 2 - 500, 300, 1000, 40); 
        ctx.fillStyle = 'black'; 
        ctx.font = '14px Arial';
        ctx.fillText(textoAyuda, canvas.width / 2, 325); 
    }

    
    ctx.fillStyle = 'white'; 
    ctx.fillRect((canvas.width - 390) / 2, 200, 400, 40); 
    ctx.fillStyle = 'black'; 
    ctx.font = '24px Arial';
    ctx.fillText("Presiona 'T' para cerrar la tienda", canvas.width / 2, 225); 
}

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



function manejarTecla(event) {
    if (event.key === 'T' || event.key === 't') {
        if (gameOver == false) {
            if (enTienda) {
                
                enTienda = false; 
                juegoEnPausa = false; 
                reanudarGeneradores(); 
                reanudarGeneradores2();
                reanudarDisparosEnemigos();
                requestAnimationFrame(actualizarJuego); 
            } else {
                
                enTienda = true; 
                juegoEnPausa = true; 
                pausarGeneradores(); 
                pausarGeneradores2();
                pausarDisparosEnemigos();
                requestAnimationFrame(actualizarJuego); 
            }
        }
    } else if (event.key === 'z' && juegoEnPausa) {
        
        reiniciarJuego(event);
    }
}



window.addEventListener('keydown', manejarTecla);

//FIN TIENDA




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
         
                window.location.href = "index.html";

            } else if (boton.texto === "Siguiente nivel") {
                const url = `boss1.html?dinero=${dineroAct}&vida=${vida}&numBalas=${numMaxBalas}&velRecarga=${velRecarga}&mejorRecar=${mejorRecar}&rafa=${rafa}`;
                window.location.href = url;
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
    if (teclas['ArrowLeft'] && nave.x > 0) {
        nave.x -= nave.speed;
    }
    if (teclas['ArrowRight'] && nave.x + nave.width < canvas.width) {
        nave.x += nave.speed;
    }
    if (teclas[' '] && !teclas.shoot) { 
        crearDisparo();
        teclas.shoot = true;
    }
    if (!teclas[' ']) teclas.shoot = false; 
}


let rafa=rafaL;
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

    for (let i = 0; i < 6; i++) {
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
                console.log("Te mató 1 por fondo");
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

        
        enemigos2.forEach((enemigo2, e2Index) => {
            if (
                disparo.x > enemigo2.x &&
                disparo.x < enemigo2.x + enemigo2.width &&
                disparo.y > enemigo2.y &&
                disparo.y < enemigo2.y + enemigo2.height &&
                !enemigo2.eliminado 
            ) {
                disparos.splice(dIndex, 1); 
                puntaje=puntaje+2;
                dineroAct=dineroAct+2;

                
                explosiones.push({ x: enemigo2.x, y: enemigo2.y });

                const sonidoPerdidaVidaRep = new Audio('mp3/bonk.mp3'); 
                sonidoPerdidaVidaRep.play();

                
                enemigos2.splice(e2Index, 1); 

                
                setTimeout(() => {
                    explosiones.splice(explosiones.findIndex(ex => ex.x === enemigo2.x && ex.y === enemigo2.y), 1);
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
                console.log("Te mató 1 toque");
                juegoEnPausa = true;
                sonarFinJuego();
            }
        }
    });

    
    enemigos2.forEach((enemigo2, e2Index) => {
        if (
            !enemigo2.eliminado && 
            nave.x < enemigo2.x + enemigo2.width &&
            nave.x + nave.width > enemigo2.x &&
            nave.y < enemigo2.y + enemigo2.height &&
            nave.y + nave.height > enemigo2.y
        ) {
            enemigos2.splice(e2Index, 1); 
            vida--;
            
            const sonidoPerdidaVidaRep = new Audio('mp3/dolor.mp3');
            sonidoPerdidaVidaRep.play();

            if (vida <= 0) {
                console.log("Te mató 2 por toque");
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
    ctx.fillText('Presiona Z para volver a jugar', canvas.width / 2, canvas.height - 30); 

    
    window.addEventListener('keydown', reiniciarJuego);
}



function reiniciarJuego(event) {
    if (event.key === 'z' && juegoEnPausa) {
        location.reload(); 
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










//Enemigo 2 ------------------------------------------------------------------------------------------------------------------------------------------------------------
let disparosEnemigos = [];
let velocidadDisparoEnemigo = 5;
let enemigos2 = []; 
const imagenEnemigo2 = new Image();
imagenEnemigo2.src = 'img/enemigo2.png'; 
let velocidadEnemigo2 = 0.4; 
let temSpawn2 = 5000;

function crearEnemigo2() {
    const tamaño = 50;
    const posicionX = Math.random() * (canvas.width - tamaño); 

    enemigos2.push({
        x: posicionX,
        y: 0,
        width: tamaño,
        height: tamaño,
        eliminado: false,
        velocidad: (Math.random() * 2 + 1)*factorVel 
    });
}

function moverEnemigos2() {
    enemigos2.forEach((enemigo, index) => {
        enemigo.y += velocidadEnemigo2*factorVel; 
        enemigo.x += (enemigo.velocidad); 

        
        if (enemigo.x + enemigo.width > canvas.width || enemigo.x < 0) {
            enemigo.velocidad *= -1; 
        }

        
        if (enemigo.y > canvas.height) {
            enemigos2.splice(index, 1); 
            vida--; 
            
            const sonidoPerdidaVidaRep = new Audio('mp3/dolor.mp3'); 
            sonidoPerdidaVidaRep.play();
            if (vida <= 0) {
                console.log("Te mató 2 por fondo");
                juegoEnPausa = true; 
                sonarFinJuego(); 
            }
        }
    });
}


function crearDisparoEnemigo(enemigo) {
    disparosEnemigos.push({
        x: enemigo.x + enemigo.width / 2, 
        y: enemigo.y + enemigo.height, 
        width: 5, 
        height: 20, 
        eliminado: false 
    });
}

function moverDisparosEnemigos() {
    disparosEnemigos.forEach((disparo, index) => {
        disparo.y += velocidadDisparoEnemigo*factorVel; 

        
        if (disparo.y > canvas.height) {
            disparosEnemigos.splice(index, 1); 
        }
        
        
        if (
            nave.x < disparo.x + disparo.width &&
            nave.x + nave.width > disparo.x &&
            nave.y < disparo.y + disparo.height &&
            nave.y + nave.height > disparo.y
        ) {
            disparosEnemigos.splice(index, 1); 
            vida--; 
            
            const sonidoPerdidaVidaRep = new Audio('mp3/dolor.mp3'); 
            sonidoPerdidaVidaRep.play();

            if (vida <= 0) {
                console.log("Te mató 2 por tiro");
                juegoEnPausa = true;
                sonarFinJuego();
            }
        }
    });
}


function enemigoDispara() {


    enemigos2.forEach(enemigo => {
        if (!enemigo.eliminado) {
            crearDisparoEnemigo(enemigo); 
        }
    });
}



function detectarColisionConDisparosEnemigos() {
    disparosEnemigos.forEach((disparo, dIndex) => {
        if (
            disparo.x > nave.x &&
            disparo.x < nave.x + nave.width &&
            disparo.y > nave.y &&
            disparo.y < nave.y + nave.height
        ) {
            disparosEnemigos.splice(dIndex, 1); 
            vida--; 
            if (vida <= 0) {
                console.log("Te mató 2 por disparo ¿qué?");
                juegoEnPausa = true;
                sonarFinJuego(); 
            }
        }
    });
}







let tempDisparoEnemigo=2000;
let intervaloDisparoEnemigos; 


function iniciarDisparosEnemigos() {
    intervaloDisparoEnemigos = setInterval(enemigoDispara, tempDisparoEnemigo); 
}


function pausarDisparosEnemigos() {
    clearInterval(intervaloDisparoEnemigos); 
}


function reanudarDisparosEnemigos() {
    iniciarDisparosEnemigos(); 
}


function cambiarTempDisparoEnemigos(nuevoTemp) {
    tempDisparoEnemigo = nuevoTemp; 
    pausarDisparosEnemigos(); 
    iniciarDisparosEnemigos(); 
}



iniciarDisparosEnemigos(); 
function dibujarEnemigos2() {
    enemigos2.forEach(enemigo => {
        if (!enemigo.eliminado) {
            ctx.drawImage(imagenEnemigo2, enemigo.x, enemigo.y, enemigo.width, enemigo.height);
        }
    });
}





let intervaloGenerarEnemigos2; 
let intervaloMoverEnemigos2; 


function iniciarGeneradores2() {
    intervaloGenerarEnemigos2 = setInterval(crearEnemigo2, temSpawn2); 
    intervaloMoverEnemigos2 = setInterval(moverEnemigos2, tempBaja2); 
}


function pausarGeneradores2() {
    clearInterval(intervaloGenerarEnemigos2);
    clearInterval(intervaloMoverEnemigos2);
}


function reanudarGeneradores2() {
    iniciarGeneradores2(); 
}


function cambiarTempSpawn2(nuevoTemp) {
    temSpawn2 = nuevoTemp; 
    pausarGeneradores2(); 
    iniciarGeneradores2(); 
}



iniciarGeneradores2(); 






function dibujarDisparosEnemigos() {
    disparosEnemigos.forEach(disparo => {
        ctx.fillStyle = 'red'; 
        ctx.fillRect(disparo.x, disparo.y, disparo.width, disparo.height); 
    });
}

//Fin Enemigo 2 ------------------------------------------------------------------------------------------------------------------------------------------------------------



const ostNivel = new Audio('mp3/nivel2.mp3');

let yaMas=false;
let yaMas2=false;

const danger = new Audio('mp3/danger.mp3');

function actualizarJuego() {
    ostNivel.play();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'left'; 

    
    if (puntaje >= 200 && !yaAcabo) {
        juegoEnPausa = true;
        yaAcabo = true;
        pausarGeneradores();
        completado();
    }

    if(yaMas==false && puntaje>50){
        console.log("Amuenta")
        yaMas=true;
        tempSpawn1=tempSpawn1-1000;
        cambiarTempSpawn(tempSpawn1);
        temSpawn2=temSpawn2-1000;
        cambiarTempSpawn2(temSpawn2)
        danger.play();

    }

    if(yaMas2==false && puntaje>100){
        console.log("Amuenta")
        yaMas2=true;
        tempSpawn1=tempSpawn1-500;
        cambiarTempSpawn(tempSpawn1);
        temSpawn2=temSpawn2-1000;
        cambiarTempSpawn2(temSpawn2)
        danger.play();

    }

    if (!juegoEnPausa && !complet) { 
        moverNave();
        moverDisparos();
        moverEnemigos();
        moverEnemigos2(); 
        detectarColision();
        moverDisparosEnemigos(); 
        //detectarColisionConDisparosEnemigos();
        
    }

    dibujarNave();
    dibujarDisparos();
    dibujarEnemigos();

    dibujarEnemigos2(); 
    dibujarDisparosEnemigos();

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

