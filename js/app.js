const resultado = document.querySelector( '#resultado' );
const formularo = document.querySelector( '#formulario' );
const paginacionDiv = document.querySelector( '#paginacion' );
const registrosPorPagina = 50;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formularo.addEventListener( 'submit', validarFormulario );
}

function validarFormulario( e ) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector( '#termino' ).value;

    if ( terminoBusqueda === '' ) {
        mostrarAlerta( 'Agrega un término de búsqueda' );
        return;
    }
    // Una vez pasada la validación y se comprueba que se ha introducido un término de búsqueda
    buscarImagen();
}

function mostrarAlerta( mensaje ) {

    const existeAlerta = document.querySelector( '.bg-red-100' );

    if ( !existeAlerta ) {
        const alerta = document.createElement( 'P' );
        alerta.classList.add( 'bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center' );
        alerta.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class="block sm:inline">${mensaje}</span>
    `;
        formularo.appendChild( alerta );
        setTimeout( () => {
            alerta.remove();
        }, 1000 );
    }
}

function buscarImagen() {
    const termino = document.querySelector( '#termino' ).value;
    const key = '22512521-67fe2c7e1470543d3bdbc3cef';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch( url )
        .then( respuesta => respuesta.json() )
        .then( resultado => {
            totalPaginas = calcularPaginas( resultado.totalHits );
            mostrarImagenes( resultado.hits )
        } )
}

// Generador que va a registrar la cantidad de elementos de acuerdo a las páginas
function* crearPaginador( total ) {
    for ( let i = 1; i <= total; i++ ) {
        yield i;
    }
}

// Paginación de los resultados
function calcularPaginas( total ) {
    return parseInt( Math.ceil( total / registrosPorPagina ) );
}

function mostrarImagenes( imagenes ) {
    // limpiar los resultados de la consulta previa
    while ( resultado.firstChild ) {
        resultado.removeChild( resultado.firstChild );
    }
    // Iterar sobre el arreglo de imagenes y construir el HTML
    imagenes.forEach( imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">
                    <div class="p-4">
                        <p class="font-bold">${likes}<span class="font-light"> Me Gusta </span></p>
                        <p class="font-bold">${views}<span class="font-light"> Vistas </span></p>
                        <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                        href="${largeImageURL}" target="_blank" rel="noopener noreferrer"> Ver Imagen
                        </a>
                    </div>
                    </div>
                </div>
            </div>
        `
    } );
    // Limpiar el paginador previo
    while ( paginacionDiv.firstChild ) {
        paginacionDiv.removeChild( paginacionDiv.firstChild );
    }
    // Generar el nuevo HTML con el paginador
    imprimirPaginador();
}

function imprimirPaginador() {
    // Paginador
    iterador = crearPaginador( totalPaginas );

    while ( true ) {
        const { value, done } = iterador.next();
        if ( done ) return;

        // Caso contrario, genera un botón por caa elemento del generador
        const boton = document.createElement( 'A' )
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add( 'siguiente', 'mx-auto', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-5', 'rounded', 'justify-center' );

        boton.onclick = () => {
            paginaActual = value;
            buscarImagen();
        }

        paginacionDiv.appendChild( boton );
    }
}
