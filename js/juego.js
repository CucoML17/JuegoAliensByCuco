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



//let factorVel =0.5;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

//Los hilos tipo processing
const sonidoFinJuego = new Audio('mp3/fin.mp3'); // Cambia la ruta a la correcta
const imagenNaveFinal = new Image();
imagenNaveFinal.src = 'img/explosion.png'; // Cambia la ruta a la correcta
const imagenFinJuego = new Image();
imagenFinJuego.src = 'img/skill.png'; // Cambia la ruta a la correcta
let juegoEnPausa = false; // Variable para pausar el juego

let gameOver=false;

let dX = canvas.width;
let dY = canvas.height;

// Llama a la función al cargar la página y cada vez que se redimensione la ventana
window.addEventListener('resize', ajustarCanvas);
ajustarCanvas()
// Dibuja la nave en el canvas
const imagenNave = new Image();
imagenNave.src = "img/nave.png"; // Cambia esta ruta a la de tu imagen

const imagenNaveDolor = new Image();
imagenNaveDolor.src = "img/explosion.png";

function dibujarNave() {
    // Asegúrate de que la imagen esté completamente cargada antes de dibujarla
    if (imagenNave.complete) {
        ctx.drawImage(imagenNave, nave.x, nave.y, nave.width, nave.height); // Dibuja la imagen de la nave
    } else {
        // Si la imagen aún no ha cargado, usa un evento onload para dibujarla cuando esté lista
        imagenNave.onload = () => {
            ctx.drawImage(imagenNave, nave.x, nave.y, nave.width, nave.height);
        };
    }
}

function dibujarNaveMuerte() {
    // Asegúrate de que la imagen esté completamente cargada antes de dibujarla
    if (imagenNaveDolor.complete) {
        ctx.drawImage(imagenNaveDolor, nave.x, nave.y, nave.width, nave.height); // Dibuja la imagen de la nave
    } else {
        // Si la imagen aún no ha cargado, usa un evento onload para dibujarla cuando esté lista
        imagenNaveDolor.onload = () => {
            ctx.drawImage(imagenNaveDolor, nave.x, nave.y, nave.width, nave.height);
        };
    }
}

// Configuración de la nave
const nave = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 70,
    width: 60,
    height: 60,
    speed: 5 * factorVel // Velocidad de movimiento de la nave
};

// Variables globales para control de enemigos
let tempSpawn1 = 4000; // Intervalo de aparición de enemigos en milisegundos (4 segundos)
let tempBaja1 = 2000; // Intervalo de bajada de enemigos en milisegundos (2 segundos)
let velocidadEnemigo = 1; // Velocidad de movimiento descendente de los enemigos

// Puntaje---------------
let puntaje = 0;
let dineroAct = 100;
function dibujarPuntaje() {
    ctx.font = '26px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Puntaje: ${puntaje}`, 10, 30);
    ctx.font = '16px Arial';
    ctx.fillText(`Puntaje necesario: 100`, 10, 60);
}

// VIDA--------------
let vida = 5;
const imagenVida = new Image();
imagenVida.src = 'img/cora.png'; // Coloca aquí la ruta de tu imagen
function dibujarVidas() {
    ctx.font = '26px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Vida', canvas.width - 100, canvas.height - 60); // Título

    const espacioEntreVidas = 25; // Espacio entre los corazones
    const anchoVida = 20; // Ancho de cada corazón
    const maxVidasPorFila = 5; // Número máximo de vidas por fila
    let fila = 0; // Contador de filas

    for (let i = 0; i < vida; i++) {
        // Calcular la posición X y Y de cada corazón
        const x = canvas.width - 150 + (i % maxVidasPorFila) * espacioEntreVidas; // X
        const y = canvas.height - 30 + fila * (anchoVida + 10); // Y

        // Si i excede el número de vidas por fila, incrementamos la fila
        if (i > 0 && i % maxVidasPorFila === 0) {
            fila++;
        }

        // Dibuja el corazón en la posición calculada
        ctx.drawImage(imagenVida, x, y-20, anchoVida, anchoVida);
    }
}



//---BALAS---
let municion = 3; // Inicialmente tiene 3 balas
let numMaxBalas = 3; // Máximo de balas
let velRecarga = 500; // Velocidad de recarga en milisegundos

let intervaloRecarga; 

function recargarMunicion() {

    if (municion < numMaxBalas) {
        municion++;
    }
}
function iniciarRecarga() {
    // Si ya hay un intervalo activo, lo detiene
    if (intervaloRecarga) {
        clearInterval(intervaloRecarga);
    }

    // Inicia un nuevo intervalo con el valor de velRecarga
    intervaloRecarga = setInterval(recargarMunicion, velRecarga);
}
function cambiarVelRecarga(nuevaVel) {
    velRecarga = nuevaVel; // Cambia el valor de velRecarga
    iniciarRecarga(); // Reinicia la recarga con el nuevo valor
}

// Llama a la función de recarga cada medio segundo
iniciarRecarga();


const imagenMunicion = new Image();
imagenMunicion.src = 'img/bullet.png'; // Coloca aquí la ruta de tu imagen

function dibujarMunicion() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Munición', 10, canvas.height - 40); // Título

    for (let i = 0; i < municion; i++) {
        ctx.drawImage(imagenMunicion, 10 + i * 25, canvas.height - 30, 20, 20);
    }
}





//TIENDA
let mejorRecar=0;
canvas.addEventListener('mousedown', manejarClick);

function manejarClick(event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    // Dibuja los botones de la tienda para verificar en cuál se hizo clic
    const botones = ["Munición", "Reparar", "Recarga", "Rafaga"];
    const espacioEntreBotones = 10;
    const anchoBoton = 100;
    const yBoton = 100;

    botones.forEach((texto, i) => {
        const x = (canvas.width - (anchoBoton * botones.length + espacioEntreBotones * (botones.length - 1))) / 2 + i * (anchoBoton + espacioEntreBotones);
        
        // Verifica si el mouse está sobre el botón
        const estaSobreBoton = mouseX >= x && mouseX <= x + anchoBoton && mouseY >= yBoton && mouseY <= yBoton + 40;

        if (estaSobreBoton) {
            if (texto === "Munición") {
                // Lógica para el botón Munición
                if (dineroAct >= 50 && numMaxBalas < 6) {
                    dineroAct -= 50; // Descuenta el dinero
                    numMaxBalas += 1; // Incrementa el número máximo de balas
                    console.log("Compraste una mejora de munición");
                    ctx.fillStyle = 'yellow'; // Color de fondo
                    ctx.fillRect(10, 10, 150, 30); // Rectángulo para el fondo
                
                    // Dibuja el texto de dinero
                    ctx.fillStyle = 'black'; // Color del texto
                    ctx.font = '16px Arial'; // Estilo de fuente
                    ctx.fillText("Dinero: $" + dineroAct, 15, 30);                    
                } else {
                    console.log("No tienes suficiente dinero o el máximo de balas ya se ha alcanzado.");
                }
            }
            if (texto === "Reparar") {
                // Lógica para el botón Munición
                if (dineroAct >= 25 && vida < 9) {
                    dineroAct -= 25; // Descuenta el dinero
                    vida += 1; // Incrementa el número máximo de balas
                    console.log("Compraste una mejora de munición");
                    ctx.fillStyle = 'yellow'; // Color de fondo
                    ctx.fillRect(10, 10, 150, 30); // Rectángulo para el fondo
                
                    // Dibuja el texto de dinero
                    ctx.fillStyle = 'black'; // Color del texto
                    ctx.font = '16px Arial'; // Estilo de fuente
                    ctx.fillText("Dinero: $" + dineroAct, 15, 30);                    
                } else {
                    console.log("No tienes suficiente dinero o el máximo de balas ya se ha alcanzado.");
                }
            }      
            
            if (texto === "Recarga") {
                // Lógica para el botón Munición
                if (dineroAct >= 150 && mejorRecar < 3) {
                    dineroAct -= 150; // Descuenta el dinero
                    mejorRecar++;
                    velRecarga=velRecarga-125;
                    cambiarVelRecarga(velRecarga)
                    console.log("Compraste una mejora de munición");
                    ctx.fillStyle = 'yellow'; // Color de fondo
                    ctx.fillRect(10, 10, 150, 30); // Rectángulo para el fondo
                
                    // Dibuja el texto de dinero
                    ctx.fillStyle = 'black'; // Color del texto
                    ctx.font = '16px Arial'; // Estilo de fuente
                    ctx.fillText("Dinero: $" + dineroAct, 15, 30);                    
                } else {
                    console.log("No tienes suficiente dinero o el máximo de balas ya se ha alcanzado.");
                }
            }        
            
            if (texto === "Rafaga") {
                // Lógica para el botón Munición
                if (dineroAct >= 200 && rafa < 3) {
                    dineroAct -= 200; // Descuenta el dinero
                    
                    rafa=rafa+1;
                    
                    console.log("Compraste una mejora de munición");
                    ctx.fillStyle = 'yellow'; // Color de fondo
                    ctx.fillRect(10, 10, 150, 30); // Rectángulo para el fondo
                
                    // Dibuja el texto de dinero
                    ctx.fillStyle = 'black'; // Color del texto
                    ctx.font = '16px Arial'; // Estilo de fuente
                    ctx.fillText("Dinero: $" + dineroAct, 15, 30);                    
                } else {
                    console.log("No tienes suficiente dinero o el máximo de balas ya se ha alcanzado.");
                }
            }   
            // Puedes agregar más condiciones aquí para otros botones...
        }
    });
}


let enTienda = false; 

let botonSeleccionado = null; // Para rastrear qué botón está hovered
let textoAyuda = ""; // Texto que se mostrará al pasar el ratón sobre un botón


function mostrarMenuTienda(mouseX, mouseY) {
    // Dibuja un rectángulo oscuro en todo el canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Color negro con transparencia
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibuja el fondo amarillo para el texto de dinero
    ctx.fillStyle = 'yellow'; // Color de fondo
    ctx.fillRect(10, 10, 150, 30); // Rectángulo para el fondo

    // Dibuja el texto de dinero
    ctx.fillStyle = 'black'; // Color del texto
    ctx.font = '16px Arial'; // Estilo de fuente
    ctx.fillText("Dinero: $" + dineroAct, 15, 30); // Dibuja el texto

    // Título del menú
    ctx.fillStyle = 'white'; // Color del texto
    ctx.font = '24px Arial'; // Estilo de fuente
    ctx.textAlign = 'center'; // Alinear el texto al centro
    ctx.fillText("~ Tienda los sueños rotos de Cuco ~", canvas.width / 2, 50); // Título centrado

    // Dibuja los botones de la tienda
    const botones = ["Munición", "Reparar", "Recarga", "Rafaga"];
    const espacioEntreBotones = 10;
    const anchoBoton = 100;
    const yBoton = 100;

    botones.forEach((texto, i) => {
        const x = (canvas.width - (anchoBoton * botones.length + espacioEntreBotones * (botones.length - 1))) / 2 + i * (anchoBoton + espacioEntreBotones);
        
        // Verifica si el mouse está sobre el botón
        const estaSobreBoton = mouseX >= x && mouseX <= x + anchoBoton && mouseY >= yBoton && mouseY <= yBoton + 40;

        if (estaSobreBoton) {
            ctx.fillStyle = 'lightgray'; // Color del botón cuando está hovered
            botonSeleccionado = texto; // Almacena el texto del botón hovered
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
            ctx.fillStyle = 'white'; // Color del botón normal
        }

        ctx.fillRect(x, yBoton, anchoBoton, 40); // Dibuja el botón
        ctx.fillStyle = 'black'; // Color del texto
        ctx.fillText(texto, x + anchoBoton / 2, yBoton + 25); // Dibuja el texto del botón
    });

    // Dibuja el texto de ayuda si hay un botón seleccionado
    if (botonSeleccionado) {
        ctx.fillStyle = 'white'; // Color de fondo del texto de ayuda
        ctx.fillRect(canvas.width / 2 - 500, 300, 1000, 40); // Fondo del texto
        ctx.fillStyle = 'black'; // Color del texto
        ctx.font = '14px Arial';
        ctx.fillText(textoAyuda, canvas.width / 2, 325); // Dibuja el texto de ayuda
    }

    // Botón para cerrar la tienda
    ctx.fillStyle = 'white'; // Color del botón
    ctx.fillRect((canvas.width - 390) / 2, 200, 400, 40); // Botón largo
    ctx.fillStyle = 'black'; // Color del texto
    ctx.font = '24px Arial';
    ctx.fillText("Presiona 'T' para cerrar la tienda", canvas.width / 2, 225); // Mensaje del botón
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

    mostrarMenuTienda(mouseX, mouseY); // Llama a la función con las coordenadas del mouse
    }
});



function manejarTecla(event) {
    if (event.key === 'T' || event.key === 't') {
        if (gameOver == false) {
            if (enTienda) {
                // Cerrar la tienda
                enTienda = false; // Vuelve al estado anterior del juego
                juegoEnPausa = false; // Reinicia el juego
                reanudarGeneradores(); // Reinicia los generadores
                requestAnimationFrame(actualizarJuego); // Continúa el juego
            } else {
                // Abrir la tienda
                enTienda = true; // Abre el menú de la tienda
                juegoEnPausa = true; // Pausa el juego
                pausarGeneradores(); // Detiene los generadores
                requestAnimationFrame(actualizarJuego); // Muestra el menú de la tienda
            }
        }
    } else if (event.key === 'z' && juegoEnPausa) {
        // Reiniciar el juego si se está en la pantalla de fin
        reiniciarJuego(event);
    }
}


// Escuchar la tecla "T"
window.addEventListener('keydown', manejarTecla);

//FIN TIENDA




//Completado-------
let complet = false;
let opacidadFondo = 0; // Opacidad inicial del fondo
const imagenTitulo = new Image(); // Imagen para el título
imagenTitulo.src = "img/nvComplete.png"; // Ruta de la imagen
const botones = [
    { texto: "Volver al menú", x: 150+320, y: 350, ancho: 150, alto: 50 },
    { texto: "Siguiente nivel", x: 350+320, y: 350, ancho: 150, alto: 50 }
];
let yaAcabo = false;

function completado() {
    complet = true; // Cambiamos el estado a "completado"
    opacidadFondo = 0; // Reiniciamos la opacidad al comenzar la pantalla de completado

    requestAnimationFrame(dibujarPantallaCompletado); // Iniciamos la animación de completado
}

function dibujarPantallaCompletado() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarNave();
    dibujarDisparos();
    dibujarEnemigos();
    dibujarPuntaje();
    dibujarVidas();
    dibujarMunicion();
    
    // Aumentamos gradualmente la opacidad hasta 1 (sólido)
    opacidadFondo = Math.min(opacidadFondo + 0.01, 1);

    // Dibujamos el rectángulo de fondo con opacidad variable
    ctx.fillStyle = `rgba(0, 0, 0, ${opacidadFondo})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujamos la imagen del título cuando la opacidad es suficiente
    if (opacidadFondo >= 0.5) {
        ctx.globalAlpha = opacidadFondo;
        ctx.drawImage(imagenTitulo, (canvas.width - 750) / 2, 50, 750, 200);
        ctx.globalAlpha = 1; // Restauramos la opacidad para otros elementos
    }

    // Dibujamos los botones
    botones.forEach(boton => {
        // Color de los botones
        ctx.fillStyle = "white";
        ctx.fillRect(boton.x, boton.y, boton.ancho, boton.alto);

        // Texto del botón
        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(boton.texto, boton.x + boton.ancho / 2, boton.y + boton.alto / 2);
    });

    // Continuamos el ciclo de animación hasta completar la opacidad
    if (opacidadFondo < 1) {
        requestAnimationFrame(dibujarPantallaCompletado);
    }
}

// Agregar eventos de clic para los botones
canvas.addEventListener("click", (event) => {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    botones.forEach(boton => {
        // Verificamos si se ha hecho clic en un botón
        if (
            mouseX >= boton.x &&
            mouseX <= boton.x + boton.ancho &&
            mouseY >= boton.y &&
            mouseY <= boton.y + boton.alto
        ) {
            if (boton.texto === "Volver al menú") {
         
                window.location.href = "index.html";

            } else if (boton.texto === "Siguiente nivel") {
                const url = `nivel2.html?dinero=${dineroAct}&vida=${vida}&numBalas=${numMaxBalas}&velRecarga=${velRecarga}&mejorRecar=${mejorRecar}&rafa=${rafa}`;
                window.location.href = url;
            }
        }
    });
});


//FIN Completado-----






// Variables de disparos y enemigos
const disparos = [];
let enemigos = [];

// Carga la imagen del enemigo
const imagenEnemigo = new Image();
imagenEnemigo.src = 'img/enemigo1.png'; // Coloca aquí la ruta de tu imagen

// Estado de teclas presionadas
const teclas = {};

// Carga el sonido de eliminación
const sonidoEliminacion = new Audio('mp3/bonk.mp3'); // Coloca aquí la ruta de tu sonido

// Escucha eventos de teclas y actualiza el estado de teclas
document.addEventListener('keydown', (event) => {
    teclas[event.key] = true;
});
document.addEventListener('keyup', (event) => {
    teclas[event.key] = false;
});

// Función para mover la nave en función del estado de teclas
function moverNave() {
    if (teclas['ArrowLeft'] && nave.x > 0) {
        nave.x -= nave.speed*factorVel;
    }
    if (teclas['ArrowRight'] && nave.x + nave.width < canvas.width) {
        nave.x += nave.speed*factorVel;
    }
    if (teclas[' '] && !teclas.shoot) { // Disparo solo cuando se presiona espacio por primera vez
        crearDisparo();
        teclas.shoot = true;
    }
    if (!teclas[' ']) teclas.shoot = false; // Resetea el disparo al soltar la tecla
}

// Crea un disparo desde la nave
let rafa=0;
function crearDisparo() {
    
    if (municion > 0) { // Verifica si hay munición
        for(i=0; i<=rafa;i++){
            const piu = new Audio('mp3/disparo.mp3'); // Cambia a la ruta correcta
            piu.play();

            disparos.push({ x: nave.x + nave.width / 2, y: nave.y-(i*10), radius: 5 });
        }
       
        municion--; // Resta una bala cada vez que se dispara
    }
}


// Mueve los disparos hacia arriba y los elimina si salen de pantalla
function moverDisparos() {
    disparos.forEach((disparo, index) => {
        disparo.y -= 7*factorVel;
        if (disparo.y < 0) disparos.splice(index, 1);
    });
}

// Dibuja los disparos como círculos
function dibujarDisparos() {



    ctx.fillStyle = '#fff';
    disparos.forEach(disparo => {
        ctx.beginPath();
        ctx.arc(disparo.x, disparo.y, disparo.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

// Crea una fila de enemigos en la parte superior
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
                eliminado: false // Añadimos esta propiedad para controlar la eliminación
            });
        }
    }
}



// Mueve los enemigos hacia abajo
const sonidoPerdidaVida = new Audio('mp3/dolor.mp3'); // Cambia la ruta a la correcta

function moverEnemigos() {
    enemigos.forEach((enemigo, index) => {
        enemigo.y += velocidadEnemigo*factorVel;

        // Verificar si el enemigo llega al fondo del canvas
        if (enemigo.y > canvas.height) {
            enemigos.splice(index, 1);
            //sonidoPerdidaVida.play();
            const sonidoPerdidaVidaRep = new Audio('mp3/dolor.mp3'); // Cambia a la ruta correcta
            sonidoPerdidaVidaRep.play();
            vida--; // Restar una vida cuando un enemigo alcanza el fondo
            if (vida <= 0) {
                juegoEnPausa = true; // Pausar el juego
                sonarFinJuego(); // Reproducir sonido de fin de juego
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
                !enemigo.eliminado // Solo detecta si el enemigo no ha sido eliminado
            ) {
                disparos.splice(dIndex, 1); // Elimina el disparo
                puntaje++;
                dineroAct++;

                // Crear explosión en la posición del enemigo eliminado
                explosiones.push({ x: enemigo.x, y: enemigo.y });

                const sonidoPerdidaVidaRep = new Audio('mp3/bonk.mp3'); // Cambia a la ruta correcta
                sonidoPerdidaVidaRep.play();

                // Elimina el enemigo completamente
                enemigos.splice(eIndex, 1); // Filtra del array

                // Elimina la explosión después de 1 segundo
                setTimeout(() => {
                    explosiones.splice(explosiones.findIndex(ex => ex.x === enemigo.x && ex.y === enemigo.y), 1);
                }, 1000);
            }
        });
    });

    // Detección de colisión entre la nave y los enemigos
    enemigos.forEach((enemigo, eIndex) => {
        if (
            !enemigo.eliminado && // Solo revisa colisiones si el enemigo sigue activo
            nave.x < enemigo.x + enemigo.width &&
            nave.x + nave.width > enemigo.x &&
            nave.y < enemigo.y + enemigo.height &&
            nave.y + nave.height > enemigo.y
        ) {
            enemigos.splice(eIndex, 1); // Elimina el enemigo de inmediato
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
imagenExplosion.src = "img/explosion.png"; // Asegúrate de que esta ruta sea correcta

// Usa un evento de carga para confirmar que la imagen se ha cargado
imagenExplosion.onload = () => {
    console.log("Imagen de explosión cargada correctamente");
};

function dibujarExplosiones() {
    explosiones.forEach(explosion => {
        ctx.drawImage(imagenExplosion, explosion.x, explosion.y, 50, 50); // Cambia 50, 50 por el tamaño deseado
    });
}





// Dibuja los enemigos usando la imagen cargada
// function dibujarEnemigos() {
//     enemigos.forEach(enemigo => {
//         ctx.drawImage(imagenEnemigo, enemigo.x, enemigo.y, enemigo.width, enemigo.height);
//     });
// }

function dibujarEnemigos() {
    enemigos.forEach(enemigo => {
        if (!enemigo.eliminado) { // Solo dibuja enemigos no eliminados
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
    juegoEnPausa = true; // Pausar el juego
    gameOver = true;
    // Cambiar la nave por una imagen
    nave.img = imagenNaveFinal; // Asumiendo que tienes una propiedad img en la nave
}

// Función para mostrar la pantalla de fin de juego
function mostrarPantallaFin() {
    // Dibuja un rectángulo oscuro en todo el canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Color negro con transparencia
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Establece el nuevo tamaño de la imagen
    const nuevaAltura = canvas.height * 0.8; // 80% de la altura del canvas
    const proporcion = imagenFinJuego.width / imagenFinJuego.height; // Relación de aspecto
    const nuevaAnchura = nuevaAltura * proporcion; // Ajusta el ancho proporcionalmente

    // Calcula las posiciones para centrar la imagen
    const x = (canvas.width - nuevaAnchura) / 2;
    const y = (canvas.height - nuevaAltura) / 2;

    // Dibuja la imagen de fin de juego
    ctx.drawImage(imagenFinJuego, x, y, nuevaAnchura, nuevaAltura);

    // Dibuja el mensaje de "Presiona Z para volver a jugar"
    ctx.fillStyle = 'white'; // Color del texto
    ctx.font = '24px Arial'; // Estilo de fuente
    ctx.textAlign = 'center'; // Alinear el texto al centro
    ctx.fillText('Presiona Z para volver a jugar', canvas.width / 2, canvas.height - 30); // Posición del texto

    // Escuchar la tecla "Z" para reiniciar el juego
    window.addEventListener('keydown', reiniciarJuego);
}


// Función para reiniciar el juego
function reiniciarJuego(event) {
    if (event.key === 'z' && juegoEnPausa) {
        location.reload(); // Reiniciar la página
    }
}






let intervaloGenerarEnemigos; // Variable para almacenar el intervalo de generación
let intervaloMoverEnemigos; // Variable para almacenar el intervalo de movimiento

// Iniciar los intervalos en algún lugar de tu código
function iniciarGeneradores() {
    intervaloGenerarEnemigos = setInterval(crearFilaEnemigos, tempSpawn1);
    intervaloMoverEnemigos = setInterval(moverEnemigos, tempBaja1);
}

// Detener los intervalos cuando el juego está en pausa
function pausarGeneradores() {
    clearInterval(intervaloGenerarEnemigos);
    clearInterval(intervaloMoverEnemigos);
}

// Reiniciar los intervalos cuando el juego se reanuda
function reanudarGeneradores() {
    iniciarGeneradores(); // Reinicia los generadores
}


function cambiarTempSpawn(nuevoTemp) {
    tempSpawn1 = nuevoTemp; // Cambia el valor del intervalo de generación
    pausarGeneradores(); // Detiene los generadores actuales
    iniciarGeneradores(); // Reinicia los generadores con el nuevo intervalo
}



// Modifica la función actualizarJuego

const ostNivel = new Audio('mp3/nivel1.mp3');

let yaMas=false;

const danger = new Audio('mp3/danger.mp3');

function actualizarJuego() {
    ostNivel.play();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'left'; 

    // Si el puntaje alcanza el límite, iniciamos el modo "completado" una vez
    if (puntaje >= 100 && !yaAcabo) {
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
        danger.play();

    }

    if (!juegoEnPausa && !complet) { // Solo actualiza el juego si no está en pausa y no en "completado"
        moverNave();
        moverDisparos();
        moverEnemigos();
        detectarColision();
    }

    dibujarNave();
    dibujarDisparos();
    dibujarEnemigos();
    dibujarExplosiones(); 
    dibujarPuntaje();
    dibujarVidas();
    dibujarMunicion();

    if (enTienda && !gameOver && !complet) {
        mostrarMenuTienda(); // Muestra el menú de la tienda
    } else if (gameOver) {
        dibujarNaveMuerte();
        mostrarPantallaFin(); // Muestra la pantalla de fin de juego
        ostNivel.pause();
    } else if (!complet) {
        requestAnimationFrame(actualizarJuego); // Continúa el ciclo de actualización
    }
}

// Inicia el bucle de actualización del juego
iniciarGeneradores();
actualizarJuego();

