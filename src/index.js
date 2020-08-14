
import './styles.css';
import{evaluarAcción} from './js/evaluar-accion';

let imagenes = ['asusaz.png', 'nnnnzz.png', 'rnslrz.png', 'reerzz.png',
                  'riirzz.png', 'rnselr.png', 'rnsilr.png', 'rrrzzz.png',
                  'rsperz.png', 'rspirz.png', 'rsprzz.png', 'rsunrz.png', 'vzzzzz.png'];

//Referencias del HTML
const rango            = document.getElementById('cont'),
      imprimeResultado = document.querySelector('#result'),
      botonera         = document.querySelector('#botonera'),
      imgVictima       = document.querySelector('#imgVictima'),
      iniciar          = document.querySelector('.iniciar'),
      btnFl2           = document.querySelectorAll('.fl2'),
      restantesHTML    = document.querySelector('#restantes'),
      correctoHTML     = document.querySelector('#correcto'),
      errorHTML        = document.querySelector('#error'),
      botones          = document.querySelectorAll('.btn'),
      correctoAud      = document.querySelector('#correctoAud'),
      errorAud         = document.querySelector('#errorAud'),
      clickAud         = document.querySelector('#clickAud'),
      respiraAud       = document.querySelector('#respira'),
      respiraRapidAud  = document.querySelector('#respiraRapid'),
      latidiAud        = document.querySelector('#latido'),
      pasuseSonidos    = document.querySelectorAll('audio'),
      check            = document.querySelector('#check');
      check.style.visibility = "hidden";

// Variables de Reloj Cuenta atrás
let idReloj;
const Tiempo = 15; //Variable que marca el tiempo de usuario para triar una víctima
let cont = Tiempo; //

// Visualización inicial del reloj
rango.innerHTML ='00:00';

//Contador orden de acción y de imágenes
let orden,
    contImagen,
    imgRestantes,
    contCorrectos = 0,
    porcCorrectos = 0,
    contErrores = 0,
    porcErrores = 0;


//Contiene imagen
let imagen;

let actualizarContadoresError;
let actualizarContenedoresAciertos;

    // //Reloj cuenta atrás
    function activaReloj(){
        idReloj =setInterval(function(){
            let contPlus = `00:${('0'+ cont).slice(-2)}`;
            rango.innerHTML = contPlus;
            cont--;
            if(cont == -1){ //Si el tiempo llega al final:
                for(let element of btnFl2){
                    element.disabled =true;
                }
                clearInterval(idReloj);
                esperarE(); // Lanza el Error de triaje.
            }
        }, 1000);
    };

// EVENTOS

    //Botón 'Iniciar Triaje'
    iniciar.addEventListener('click',() =>{

        imagenes = shuffle(imagenes);
        orden = 1;
        clearInterval(idReloj);
        cont = Tiempo;
        contImagen =0;
        imprimeResultado.innerHTML = " ";
        imgRestantes = imagenes.length;
        restantesHTML.innerHTML = imgRestantes;
        correctoHTML.innerHTML = '0 = 0 %';
        errorHTML.innerHTML = '0 = 0 %';
        contCorrectos = 0;
        contErrores = 0;
        check.style.visibility = "hidden";

        //Desordenar matriz
        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;
          
            // Mientras queden elementos a mezclar...
            while (0 !== currentIndex) {
          
              // Seleccionar un elemento sin mezclar...
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex -= 1;
          
              // E intercambiarlo con el elemento actual
              temporaryValue = array[currentIndex];
              array[currentIndex] = array[randomIndex];
              array[randomIndex] = temporaryValue;
            }
            return array;
        }

        //Activar botones
        for(let element of btnFl2){
            element.disabled =false;
        }
        //Coloco primera imágen
        imgVictima.src = `./assets/${imagenes[contImagen]}`;
        imagen = imagenes[contImagen];
        contImagen++;

        //Pongo en marcha reloj
        activaReloj();
    });


    //Aplico en Listaner al alemento padre de los botones y capturo el event
    //A través del event puedo verificar si es la clase de botón que necesito
    //Si se cumple la condición puedo ejecutar la acción necesaria.    
    botonera.addEventListener('click', event => {
        if(event.target.classList.contains('btn')){

            //Quito el foco a los botones
            for(let elemento of botones){
                elemento.blur();
            };

            //Paro y reinicio sonidos.
            for(let sonido of pasuseSonidos){
                sonido.pause();
                sonido.currentTime = 0;
            };

            //Evaluo botón pulsado
            let resultado = evaluarAcción(orden, event.target.id, imagen);
            
            switch (resultado){
                case 'ERROR':
                    clearInterval(idReloj);
                    for(let element of btnFl2){
                        element.disabled =true;
                    }
                    esperarE();
                    break;

                case 'CORRECTO':
                    clearInterval(idReloj);
                    for(let element of btnFl2){
                        element.disabled =true;
                    }
                    esperarC();
                    break;

                case 'NO RESPIRA':
                case 'SIGUE SIN<br>RESPIRAR':
                case 'NO TIENE PULSO':
                case 'BUENA COMPRESIÓN':
                case 'BUEN TORNIQUETE':
                case 'BUENA<br>POSICIÓN LATERAL':
                case 'SÍ OBEDECE ÓRDENES':
                case 'NO OBEDECE ÓRDENES':
                    clickAud.play();
                    break;

                case 'RESPIRA NORMAL':
                case 'AHORA SÍ RESPIRO':    
                    respiraAud.play();
                    break;

                case 'RESPIRA<br>MUY RÁPIDO':
                    respiraRapidAud.play();
                    break;

                case 'SÍ TIENE PULSO':
                    latidiAud.play();
                    break;
            }
            
            //Imprime resultados en complementos.
            imprimeResultado.innerHTML = resultado;
            //imprimeResultado.innerHTML = `${resultado} Orden:${orden}, event: ${event.target.id}, imagen:${imagen}`;
            orden++;
        }
    });

    const esperarC = ()=>{
        correctoAud.play();
        check.src='./assets/check.png';
        check.style.visibility = "visible";
        setTimeout(function(){
            ejecutaCorrecto();
        },2000);
    }

    const esperarE = ()=>{
        errorAud.play();
        check.src='./assets/error.png';
        check.style.visibility = "visible";
        setTimeout(function(){
            ejecutaError();
        },2000);
    }

    const ejecutaError = ()=>{
        check.style.visibility = "hidden";
        cont = Tiempo;

        if (imgRestantes!== 1){

            actualizarContadoresError = ()=>{
                //Aumneto contador de errord y porcentaje y reinicio contador de orden
                contErrores++;
                porcCorrectos = Math.round ((contCorrectos*100)/(contCorrectos + contErrores));
                correctoHTML.innerHTML = `${contCorrectos} = ${porcCorrectos} %`;
                porcErrores = Math.round ((contErrores*100)/(contCorrectos + contErrores));
                errorHTML.innerHTML = `${contErrores} = ${porcErrores} %`;
                orden = 1;
            };

            //Resto una víctima a las restantes
            imgRestantes--;
            restantesHTML.innerHTML = imgRestantes;
    
            //Aumneto contador de errord y porcentaje y reinicio contador de orden
            actualizarContadoresError();

            //Activo Reloj
            activaReloj();
    
            //Muestro víctima siguiente
            imgVictima.src = `./assets/${imagenes[contImagen]}`;
            imagen = imagenes[contImagen];
            contImagen++;

            for(let element of btnFl2){
                element.disabled =false;
            }



        }else{
            //Ejecutar Fin Triaje
            actualizarContadoresError();
            imprimeResultado.innerHTML = 'FIN DE TRIAJE';
            imgVictima.src = './assets/imgFinal.png';
            restantesHTML.innerHTML = 0;
            //Desactivar botones
            for(let element of btnFl2){
                element.disabled =true;
            };
        }     
    };

    const ejecutaCorrecto = ()=>{
        check.style.visibility = "hidden";
        cont = Tiempo;
        
        if (imgRestantes!== 1){

            actualizarContenedoresAciertos = () => {
                //Aumneto contador de aciertos y porcentaje y reinicio contador de orden
                contCorrectos++;
                porcCorrectos = Math.round ((contCorrectos*100)/(contCorrectos + contErrores));
                correctoHTML.innerHTML = `${contCorrectos} = ${porcCorrectos} %`;
                porcErrores = Math.round ((contErrores*100)/(contCorrectos + contErrores));
                errorHTML.innerHTML = `${contErrores} = ${porcErrores} %`;
                orden = 1;
            };


            //Resto una víctima a las restantes
            imgRestantes--;
            restantesHTML.innerHTML = imgRestantes;
    
            //Aumneto contador de aciertos y porcentaje y reinicio contador de orden
            actualizarContenedoresAciertos();

            //Activo Reloj
            activaReloj();
    
            //Muestro víctima siguiente
            imgVictima.src = `./assets/${imagenes[contImagen]}`;
            imagen = imagenes[contImagen];
            contImagen++;

            for(let element of btnFl2){
                element.disabled =false;
            }



        }else{
            //Ejecutar Fin Triaje
            actualizarContenedoresAciertos();
            imprimeResultado.innerHTML = 'FIN DE TRIAJE';
            imgVictima.src = './assets/imgFinal.png';
            restantesHTML.innerHTML = 0;
            //Desactivar botones
            for(let element of btnFl2){
                element.disabled =true;
            };
        }
    };

            // Cambiar imagen
            // imgVictima.src = "./assets/pseguri.png";
    
    
       











