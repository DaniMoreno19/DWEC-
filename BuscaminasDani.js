document.addEventListener('DOMContentLoaded', () => {

    const contenedorJuego = document.querySelector('.divJuego');
    const juego = document.querySelector('.juego');
    const resultado = document.querySelector('.resultado');
    const contadorBanderas = document.getElementById('num-banderas');
    const contadorBanderasRestantes = document.getElementById('banderasRestantes');
    const botonComenzar = document.querySelector('.comenzar');
    botonComenzar.addEventListener('click', generarTablero);
    let tamanio = 10;             
    let numBombas = 20;         
    let numBanderas = 0;        
    let casillas = [];          
    let finPartida = false;

    
    function añadeNumeros() {
        /*Esta función se encarga de añadir números a las casillas del juego que no contienen bombas. 
        Utiliza un bucle for para recorrer todas las casillas del tablero y comprueba si cada una es una casilla vacía.*/
        for (let i=0; i < casillas.length; i++) {
            // Nº de bombas contiguas a una casilla
            let total = 0;                                      
            // Para evaluar los bordes
            const bordeIzquierdo = (i % tamanio === 0);             
            const bordeDerecho = (i % tamanio === tamanio - 1);    

            /*Para cada casilla vacía, se comprueba el número de bombas que hay en las casillas adyacentes y 
            se almacena en un atributo "data" de la casilla.
            Se utilizan varias condiciones para comprobar las casillas adyacentes en todas las direcciones, 
            incluyendo los bordes del tablero.*/
            if (casillas[i].classList.contains('vacio')) {
                // Comprobamos casilla anterior
                if (i > 0 && !bordeIzquierdo && casillas[i-1].classList.contains('bomba')){
                    total++;
                }
                // Comprobamos casilla siguiente
                if (i < (tamanio*tamanio-1) && !bordeDerecho && casillas[i+1].classList.contains('bomba')){
                    total++;
                }
                // Comprobamos casilla superior
                if (i > tamanio && casillas[i-tamanio].classList.contains('bomba')){
                    total++;
                }
                // Comprobamos casilla siguiente de la fila anterior
                if (i > (tamanio-1) && !bordeDerecho && casillas[i+1-tamanio].classList.contains('bomba')){
                    total++;
                }
                // Comprobamos casilla anterior de la fila anterior
                if (i > tamanio && !bordeIzquierdo && casillas[i-1-tamanio].classList.contains('bomba')){
                    total++;
                }
                // Comprobamos casilla inferior
                if (i < (tamanio*(tamanio-1)) && casillas[i+tamanio].classList.contains('bomba')){
                    total++;
                }
                // Comprobamos casilla siguiente de la fila siguiente
                if (i < (tamanio*(tamanio-1)) && !bordeDerecho && casillas[i+1+tamanio].classList.contains('bomba')){
                    total++;
                }
                // Comprobamos casilla anterior de la fila siguiente
                if (i < (tamanio*(tamanio-1)) && !bordeIzquierdo && casillas[i-1+tamanio].classList.contains('bomba')){
                    total++;
                }
                // Guardamos el nº de bombas en atributo data
                casillas[i].setAttribute('data', total);
            }
        }
    }

    function añadirBandera(casilla) {
        /*Esta función añade o elimina una bandera en una casilla del juego, siempre y cuando no se haya alcanzado el 
        límite de banderas y el juego no haya terminado.*/
        if (finPartida) return;

        if (!casilla.classList.contains('marcada') && numBanderas < numBombas) {
            if (!casilla.classList.contains('bandera')) {
                casilla.classList.add('bandera');
                casilla.innerHTML = '🚩';
                numBanderas++;
                actualizarNumBanderas();
                comprobarPartida();
            } else {
                casilla.classList.remove('bandera');
                casilla.innerHTML = '';
                numBanderas--;
                actualizarNumBanderas();
            }
        }
    }

    function actualizarNumBanderas() {
        contadorBanderas.textContent = numBanderas;
        contadorBanderasRestantes.textContent = (numBombas - numBanderas);
    }


    function generarTablero() {
        /*Esta función genera un nuevo juego con un tamaño y número de bombas determinados por el usuario. 
        Comprueba que los requisitos se cumplen, crea una matriz de casillas con bombas aleatorias y las coloca en un tablero.
        A cada casilla se le añade una función para el click izquierdo y derecho. 
        También se añaden números a las casillas que rodean las bombas y se actualiza el número de banderas restantes en el juego.*/
        tamanio = parseInt(document.getElementById('tamanio').value);
        numBombas = parseInt(document.getElementById('numBombas').value);

        // Comprobamos que se cumplen los requisitos de creacion del juego
        if (tamanio<6 || tamanio>20) {
            alert(`El tamanio no puede ser menor de 6 ni mayor de 20`);
            return;
        }
        if (numBombas<1) {
            alert(`El número de bombas tiene que ser como mínimo 1`);
            return;
        }
        if (numBombas > tamanio*tamanio) {
            alert(`El número de bombas no puede ser superior al producto de \"tamanio\" x \"tamanio\" que en este caso es: ${tamanio*tamanio}`);
            return;
        }

        if (contenedorJuego.classList.contains('hidden')) {
            // Esto hace que al hacer click en "Comenzar" se quite el atributo hidden para que se vea el tablero
            contenedorJuego.classList.remove('hidden');
        } else {
            // Si no tiene clase 'hidden' es porque estamos generando un nuevo juego 
            // borramos el anterior y reiniciamos valores
            juego.innerHTML = "";
            resultado.innerHTML = "";
            resultado.className = "resultado";
            casillas = [];
            finPartida = false;
            numBanderas = 0;
        }

        // Para que el juego se vea con las casillas en orden, se les da estructuras con rem
        juego.style.width = (tamanio * 4) + 'rem';
        resultado.style.width = (tamanio * 4) + 'rem';

        // Creamos un matriz con bombas aleatorias
        const arrayBombas = Array(numBombas).fill('bomba');
        const arrayVacios = Array(tamanio*tamanio - numBombas).fill('vacio');
        const arrayCompleto = arrayVacios.concat(arrayBombas);
        arrayCompleto.sort(() =>  Math.random() - 0.5 );
        
        for(let i=0; i < tamanio*tamanio; i++) {
            const casilla = document.createElement('div');
            casilla.setAttribute('id', i);
            casilla.classList.add(arrayCompleto[i]);
            juego.appendChild(casilla);
            casillas.push(casilla);
            
            // Añadimos función al hacer click
            casilla.addEventListener('click', () => {
                click(event.target);
            });

            // Añadimos función al hacer click derecho
            casilla.oncontextmenu = function(event) {
                event.preventDefault();
                añadirBandera(casilla);
            }
        }

        añadeNumeros();
        actualizarNumBanderas();
    }

    function bomba(casillaClickeada) {
        /*La función bomba se encarga de finalizar la partida en caso de que una casilla con bomba haya sido clickeada. 
        Se establece la variable finPartida como true y se agrega la clase back-red a la casilla clickeada. */
        finPartida = true;
        casillaClickeada.classList.add('back-red');

        //Luego, se recorren todas las casillas para desvelar las bombas, quitando la clase bomba y 
        //agregando la clase marcada. Se establece el texto 'Game Over' en el elemento resultado.
        casillas.forEach((casilla, index, array) => {
            if (casilla.classList.contains('bomba')) {
                casilla.innerHTML = '💣';
                casilla.classList.remove('bomba');
                casilla.classList.add('marcada');
            }
        });

        resultado.textContent = 'Game Over';
    }
    function revelarCasillas(casilla) {
        /*La función revelarCasillas se encarga de simular el clic en las casillas adyacentes a una casilla determinada, 
        utilizando un tiempo de espera de 10ms. Para ello, se identifica la posición de la casilla en el tablero, 
        se evalúan las casillas adyacentes y se simula el clic en cada una de ellas.*/
        const idCasilla = parseInt(casilla.id);
        const bordeIzquierdo = (idCasilla % tamanio === 0);            
        const bordeDerecho = (idCasilla % tamanio === tamanio - 1);

        setTimeout(() => {
            // Simulamos clik en la casilla anterior
            if (idCasilla > 0 && !bordeIzquierdo) {
                click(casillas[idCasilla-1]);
            }    
            // Simulamos clik en la casilla siguiente
            if (idCasilla < (tamanio*tamanio-2) && !bordeDerecho){
                click(casillas[idCasilla+1]);
            } 
            // Simulamos clik en la casilla superior
            if (idCasilla >= tamanio){
                click(casillas[idCasilla-tamanio]);
            }
            // Simulamos clik en la casilla siguiente de la fila anterior
            if (idCasilla > (tamanio-1) && !bordeDerecho){
                click(casillas[idCasilla+1-tamanio]);
            }
            // Simulamos clik en la casilla anterior de la fila anterior
            if (idCasilla > (tamanio+1) && !bordeIzquierdo){
                click(casillas[idCasilla-1-tamanio]);
            }
            // Simulamos clik en la casilla inferior
            if (idCasilla < (tamanio*(tamanio-1))){
                click(casillas[idCasilla+tamanio]);
            }
            // Simulamos clik en la casilla siguiente de la fila siguiente
            if (idCasilla < (tamanio*tamanio-tamanio-2) && !bordeDerecho){
                click(casillas[idCasilla+1+tamanio]);
            }
            // Simulamos clik en la casilla anterior de la fila siguiente
            if (idCasilla < (tamanio*tamanio-tamanio) && !bordeIzquierdo){
                click(casillas[idCasilla-1+tamanio]);
            }
        }, 10);
    }

    function comprobarPartida() {
        /*Esta función se encarga de comprobar si el jugador ha ganado la partida, contando el número de casillas con bandera 
        que también contienen bombas. Si el número de aciertos coincide con el número total de bombas, 
        se declara al jugador como ganador y se actualiza el mensaje de resultado.*/
        let aciertos = 0;

        for (let i = 0; i < casillas.length; i++) {
            if (casillas[i].classList.contains('bandera') && casillas[i].classList.contains('bomba'))
                aciertos++;
        }

        if (aciertos === numBombas) {
            finPartida = true;
            resultado.textContent = 'You win!';
        }
    }

    function click(casilla) {
        /*Esta función click que maneja el evento de clic en una casilla del juego. Si la casilla clickeada no es clickeable, 
        se sale de la función.  */
        if (casilla.classList.contains('marcada') || casilla.classList.contains('bandera') || finPartida) return;

        //Si la casilla es una bomba, llama a la función bomba.
        if (casilla.classList.contains('bomba')) {
            // Casilla bomba
            bomba(casilla);
        } else {
            // Si la casilla tiene bombas cerca, la marca con el número de bombas cercanas.
            let total = casilla.getAttribute('data');
            //Si la casilla no tiene bombas cerca, llama a la función revelarCasillas para desvelar las casillas cercanas.
            if (total != 0) {
                // Casilla con bombas cerca
                casilla.classList.add('marcada');
                casilla.innerHTML = total;
                return;
            }
            casilla.classList.add('marcada');
                
            // Casilla sin bombas cerca
            revelarCasillas(casilla);

        }
    }
    
    
});