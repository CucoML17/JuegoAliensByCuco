//CANVAS y variables globales
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let nvActual="1";


//--VIDA---------------------------------------------------
let vida = 5;
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
        
        if (i > 0 && i % maxVidasPorFila == 0) {
            fila++;
        }

        
        const x = canvas.width - 150 + (i % maxVidasPorFila) * espacioEntreVidas; 
        const y = canvas.height - 30 + fila * (anchoVida + 10); 

        
        ctx.drawImage(imagenVida, x, y - 20, anchoVida, anchoVida);
    }
}
//--FIN DE VIDA---------------------------------------------------



//TIENDA
let mejorRecar=0;
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
        //mostrarMenuTienda();
        if(enTienda==true && nvActual=="1"){
            console.log("111");
            ctx.textAlign = 'left';
            dibujarNave();
            dibujarDisparos();
            dibujarEnemigos();
            dibujarPuntaje();
            dibujarVidas();
            dibujarMunicion(); 
            
            if (municion < numMaxBalas) {
                municion++;
            }
    
            mostrarMenuTienda(mouseX, mouseY); 
        }

        if(enTienda==true && nvActual=="2"){
            console.log("222");
            ctx.textAlign = 'left';
            dibujarNave();
            dibujarDisparos();
            dibujarEnemigos();
        
            dibujarEnemigos2(); 
            dibujarDisparosEnemigos();
        
            dibujarExplosiones(); 
            dibujarPuntaje();
            dibujarVidas();
            dibujarMunicion();
            if (municion < numMaxBalas) {
                municion++;
            }
    
            mostrarMenuTienda(mouseX, mouseY); 
        }


        if(enTienda==true && nvActual=="3"){
            console.log("333");
            ctx.textAlign = 'left';
            dibujarJefe();
            dibujarJefeP1D();
            dibujarJefeP2D();
            dibujarJefeP1Iz();
            dibujarJefeP2Iz();
            dibujarDisparosJefe();
            
        
        
            dibujarNave();
            dibujarDisparos();
            dibujarEnemigos();
        
            dibujarEnemigos2(); 
            dibujarDisparosEnemigos();
        
            dibujarExplosiones(); 
            dibujarPuntaje();
            dibujarVidas();
            dibujarMunicion();
            

            dibujarDisparosJefePatas(disparosJefeP1Iz, estaVidaP1Iz);
            dibujarDisparosJefePatas(disparosJefeP1D, estaVidaP1D);
            dibujarDisparosJefePatas(disparosJefeP2Iz, estaVidaP2Iz);
            dibujarDisparosJefePatas(disparosJefeP2D, estaVidaP2D);

            if (municion < numMaxBalas) {
                municion++;
            }
    
            mostrarMenuTienda(mouseX, mouseY); 
        }


    });
}
function dibujaEnTienda(){
    if(enTienda==true && nvActual=="1"){
        console.log("111");
        ctx.textAlign = 'left';
        dibujarNave();
        dibujarDisparos();
        dibujarEnemigos();
        dibujarPuntaje();
        dibujarVidas();
        dibujarMunicion(); 
        
        if (municion < numMaxBalas) {
            municion++;
        }
        dibujarMunicion();
        mostrarMenuTienda(); 
        
    }

    if(enTienda==true && nvActual=="2"){
        console.log("222");
        ctx.textAlign = 'left';
        dibujarNave();
        dibujarDisparos();
        dibujarEnemigos();
    
        dibujarEnemigos2(); 
        dibujarDisparosEnemigos();
    
        dibujarExplosiones(); 
        dibujarPuntaje();
        dibujarVidas();
        dibujarMunicion();
        if (municion < numMaxBalas) {
            municion++;
        }
        dibujarMunicion();
        mostrarMenuTienda(); 
    }


    if(enTienda==true && nvActual=="3"){
        console.log("333");
        ctx.textAlign = 'left';
        dibujarJefe();
        dibujarJefeP1D();
        dibujarJefeP2D();
        dibujarJefeP1Iz();
        dibujarJefeP2Iz();
        dibujarDisparosJefe();
        
    
    
        dibujarNave();
        dibujarDisparos();
        dibujarEnemigos();
    
        dibujarEnemigos2(); 
        dibujarDisparosEnemigos();
    
        dibujarExplosiones(); 
        dibujarPuntaje();
        dibujarVidas();
        dibujarMunicion();
        

        dibujarDisparosJefePatas(disparosJefeP1Iz, estaVidaP1Iz);
        dibujarDisparosJefePatas(disparosJefeP1D, estaVidaP1D);
        dibujarDisparosJefePatas(disparosJefeP2Iz, estaVidaP2Iz);
        dibujarDisparosJefePatas(disparosJefeP2D, estaVidaP2D);

        if (municion < numMaxBalas) {
            municion++;
        }
        dibujarMunicion();
        mostrarMenuTienda();
    }
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
    //ctx.fillText("~ Tienda los sueños rotos de Cuco ~", canvas.width / 2, 50); 

    
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




//FIN TIENDA

//Dinero y puntaje:

let puntaje = 0;
let dineroAct = 100;
function dibujarDinero() {
    ctx.font = '20px Arial';
    ctx.fillStyle = "yellow";
    ctx.fillText(`Dinero: $${dineroAct}`, 10, 100);
    ctx.font = '16px Arial';

    ctx.fillStyle = "white";
}



//MODALOSO PARA LA TIENDA
function abrirModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex'; 
}


function cerrarModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none'; 
}



//FIN DEL MODALOSO


function mostrarTexto(texto) {
    const tooltip = document.getElementById('tooltip');
    let textoAyuda = '';

    if (texto === 'Munición') {
        textoAyuda = 'Aumenta la capacidad de munición (máximo 6). Cuesta $50';
    }
    if (texto === 'Reparar') {
        textoAyuda = 'Recupera un corazón a la nave (máximo 9). Cuesta $25';
    }
    if (texto === 'Recarga') {
        textoAyuda = 'Aumenta tu velocidad de recarga en un 25% (máximo 3 compras). Cuesta $150';
    }
    if (texto === 'Ráfaga') {
        textoAyuda = 'Doble tiro! mata dos bichos de un tiro. Cuesta $200';
    }

    tooltip.textContent = textoAyuda;
    tooltip.style.display = 'block'; 
}


function ocultarTexto() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none'; 
}



function comprar(texto) {
    if (texto === "Munición") {
        if (dineroAct >= 50 && numMaxBalas < 6) {
            dineroAct -= 50;
            numMaxBalas += 1;
            console.log("Compraste una mejora de munición");
            const sonidoPerdidaVidaRep = new Audio('mp3/municion.mp3'); 
            sonidoPerdidaVidaRep.play();
            actualizarCanvas();
            dibujaEnTienda();
            
        } else {
            const sonidoPerdidaVidaRep = new Audio('mp3/noDinero.mp3'); 
            sonidoPerdidaVidaRep.play();
            console.log("No tienes suficiente dinero o el máximo de balas ya se ha alcanzado.");
        }
    }
    if (texto === "Reparar") {
        if (dineroAct >= 25 && vida < 9) {
            dineroAct -= 25;
            vida += 1;
            console.log("Compraste una reparación");
            const sonidoPerdidaVidaRep = new Audio('mp3/reparacion.mp3'); 
            sonidoPerdidaVidaRep.play();
            actualizarCanvas();
            dibujaEnTienda();
        } else {
            const sonidoPerdidaVidaRep = new Audio('mp3/noDinero.mp3'); 
            sonidoPerdidaVidaRep.play();
            console.log("No tienes suficiente dinero o el máximo de vida ya se ha alcanzado.");
        }
    }
    if (texto === "Recarga") {
        if (dineroAct >= 150 && mejorRecar < 3) {
            dineroAct -= 150;
            mejorRecar++;
            velRecarga -= 125;
            cambiarVelRecarga(velRecarga);
            console.log("Compraste una mejora de recarga");
            const sonidoPerdidaVidaRep = new Audio('mp3/recarga.mp3'); 
            sonidoPerdidaVidaRep.play();
            actualizarCanvas();
            dibujaEnTienda();
        } else {
            const sonidoPerdidaVidaRep = new Audio('mp3/noDinero.mp3'); 
            sonidoPerdidaVidaRep.play();
            console.log("No tienes suficiente dinero o ya has alcanzado el máximo de mejoras de recarga.");
        }
    }
    if (texto === "Rafaga") {
        if (dineroAct >= 200 && rafa < 3) {
            dineroAct -= 200;
            rafa += 1;
            console.log("Compraste una mejora de ráfaga");
            const sonidoPerdidaVidaRep = new Audio('mp3/rafaga.mp3'); 
            sonidoPerdidaVidaRep.play();
            actualizarCanvas();
            dibujaEnTienda();
        } else {
            const sonidoPerdidaVidaRep = new Audio('mp3/noDinero.mp3'); 
            sonidoPerdidaVidaRep.play();
            console.log("No tienes suficiente dinero o ya has alcanzado el máximo de mejoras de ráfaga.");
        }
    }
    
}

function actualizarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'yellow';
    ctx.fillRect(10, 10, 150, 30);
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText("Dinero: $" + dineroAct, 15, 30);
}