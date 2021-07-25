class Queue {
    constructor() {
        this.items = [];
        this.front = 0;
        this.end = 0;
    };

    enqueue(data) {  // Agregar elementos a la fila
        this.items[this.end] = data;
        this.end++;
    }

    dequeue() { // Eliminar Elementos de la fila
        if (this.front === this.end) {
            return null;
        }

        const data = this.items[this.front];
        delete this.items[this.front];
        this.front++
        return data;
    };

    getSize() {
        return this.end - this.front;
    };

    peek() {
        if (this.getSize() === 0) {
            return true;
        };

        return this.items[this.front];
    };

    print() {
        if (this.getSize() === 0) {
            return null;
        };

        for (let i = this.front; i < this.end; i++) {
            console.log(this.items[i]);
        }
    }
};
let fila = new Queue();

class Pila {
    constructor() {
        this.items = [];
        this.top = 0;
    };

    push(data) {
        this.items[this.top] = data;
        this.top++;
    };

    getSizePila() {
        return this.top;
    };
    isEmpty() {
        if (!this.getSizePila()) {
            return true;
        } else {
            return false;
        };
    };

    printPila() {
        for (let i = this.top; i > 0; i--) {
            console.log(this.items[i - 1]);
        }
    }
}
let pila = new Pila();

/* ----------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function() {

    obtenerCSV()
    exportarCSV()
    botonHistorial()

});

/* ----------------------------------------------------------- */

function obtenerCSV() {
    // Se verifica el soporte del API FileReader
    if (!FileReader) {
        const error = new Error(`Este navegador no soporta el API FileReader`);
        alert(error.message);
        throw error;
      }

    // Se obtiene el elemento input para leer el archivo CSV
    const input = document.getElementById(`playlist`);

    // Se valida si el elemento existe
    if (input === null) {
      const error = new Error(`No se encuentra el ID: playlist`);
      alert(error.message);
      throw error;
    }

    // Callback para leer el archivo
    input.onchange = ev => {
        // Se verifica que se haya seleccionado el archivo
        const files = ev.target.files;

        if (!files.length) {
        console.info(`No se ha seleccionado ningún archivo`);
        return;
        }

        // Se inicia la lectura del archivo
        const reader = new FileReader();
        reader.readAsText(files[0]);

        // Lectura del contenido del archivo
        reader.onload = ev => {
            const csv = ev.target.result;
            const list = [];

            // Por cada linea
            csv.split(/\n/g).forEach((line, id) => {
                // Se ignora el encabezado
                if (id === 0) return;

                // Se estructura la informacion del video
                const prop = line.split(/;/g);

                list.push({
                id,
                type: prop[0] || null,
                title: prop[1] || null,
                author: prop[2] || null,
                genre: prop[3] || null,
                year: parseInt(prop[4]) || null,
                path: prop[5] || null,
                });
            });

            reiniciarEstructuras()
            boton = document.getElementById('botonExportar')
            boton.classList.remove('ocultar')
            document.getElementById('export').classList.remove('noMostrar')
            imprimirPlaylist(list)
        }
        // Callback de error de lectura
        reader.onerror = ev => {
            console.error(ev);
        }
    };
}

/* ----------------------------------------------------------- */

function imprimirPlaylist(lista) {
    lista.forEach(element => {
        /* if (confirm(`Quieres elegir este ${element.type} para reproducir?\n${element.id}: ${element.title}`)) {
        } */
        fila.enqueue(element);
    });
    /* fila.print() */
    reproduciendo = fila.items

    if (fila.getSize() !== 0) {
        // Se reproduce el elemento de la lista
        crearReproductor(reproduciendo[0]);
    } else {
        alert('No hay archivos para reproducir')
    }
    listaReproducción(reproduciendo)
}

/* ----------------------------------------------------------- */

function eliminarArchivo() {
    if (fila.getSize() !== 0) {
        pila.push(fila.dequeue());
    } else {
        alert('No hay más archivos para eliminar, la PlayList ya se reprodució toda');
    }
}

function verHistorial() {

    if (pila.isEmpty()) {
        alert('No hay archivos reproducidos hasta el momento')
    } else {
        console.log('Historial de reproducción:\n\n')
        pila.printPila()
    }
}

/* ----------------------------------------------------------- */

function exportarCSV() {
    // Se obtiene el botón para exportar el archivo CSV
    const output = document.getElementById(`export`);

    // Se valida si el elemento existe
    if (output === null) {
        const error = new Error(`No se encuentra el ID: export`);
        alert(error.message);
        throw error;
    }

    // Callback para exportar el archivo
    output.onclick = () => {
        // Se verifica el tamaño de la fila
        const newPlaylist = []
        reproduciendo.forEach(CSV => {
            newPlaylist.push(CSV)
        });

        if (newPlaylist.length === 0) {
            alert(`La fila está vacía`);
            return;
        }
        console.log(newPlaylist);

        // Inicialización del contenido del archivo CSV sólo con el encabezado
        let csv = `data:text/csv;charset=utf-8,type;title;author;genre;year;path`;

        // Para cada item de la fila
        newPlaylist.forEach(item => {
            csv += `\r\n${item.type || ``};`;
            csv += `${item.title || ``};`;
            csv += `${item.author || ``};`;
            csv += `${item.genre || ``};`;
            csv += `${item.year || ``};`;
            csv += `${item.path || ``};`;
        });

        // Se codifica el contenido del archivo
        const content = encodeURI(csv);

        // Se crea un elemento anchor para escargar el archivo CSV
        const anchor = document.createElement(`a`);
        anchor.setAttribute(`href`, content);
        anchor.setAttribute(`download`, `reproduciendo.csv`);

        // Se dispara el evento click para iniciar la descarga del archivo
        anchor.click();

        eliminarElementos()
        reiniciarEstructuras()

        document.getElementById('botonExportar').classList.add('ocultar')
    }
}

/* ----------------------------------------------------------- */

// Configura el reproductor para el elemento indicado
function crearReproductor(element) {
    // Reiniciar reproductor
    const player = document.getElementById(`player`);

    while (player.firstChild) {
      player.removeChild(player.firstChild);
    }

    // Configura el reproductor con el elemento actual
    const media = document.createElement(element.type);
    media.setAttribute(`controls`, ``);
    media.setAttribute(`autoplay`, ``);
    media.id = 'medio'
    if (element.type == 'audio') {
        media.classList.add('audio')
    } else {
        media.classList.add('video')
    }

    const source = document.createElement(`source`);
    source.setAttribute(`src`, element.path);
    source.setAttribute(`type`, `${element.type}/${element.path.slice(element.path.lastIndexOf(`.`) + 1)}`);

    // Agrega el elemento al reproductor
    media.appendChild(source);
    player.appendChild(media);

    medio = document.getElementById('medio')

    reproducirSiguiente()
};

/* ----------------------------------------------------------- */

function reproducirSiguiente() {
    medio.addEventListener('ended', function () {
        eliminarArchivo()
        const lista = document.getElementById('cuerpoLista')
        lista.removeChild(lista.firstChild)
        
        if (fila.getSize() !== 0) {
            crearReproductor(fila.peek());
        } else {
            alert('No hay archivos para reproducir')
            
            eliminarElementos()
            
            if (confirm(`Desea ver el historial de reproducción en consola?`)) {
                verHistorial()
            }
        }
    })
}

/* ----------------------------------------------------------- */

function reiniciarEstructuras() {
    fila = new Queue();
    pila = new Pila();
}

/* ----------------------------------------------------------- */

function listaReproducción(list) {
    const tabla = document.getElementById('reproduccion')

    while (tabla.firstChild) {
        tabla.removeChild(tabla.firstChild);
    }

    const header = document.createElement('thead')
    tabla.appendChild(header)

    const array = [ `ID`, `Tipo`, `Título`, `Autor`, `Género`, `Año`]
    array.forEach(title => {
        const head = document.createElement('th')
        head.textContent = title;

        header.appendChild(head);
    });

    const body = document.createElement(`tbody`);
    body.id = 'cuerpoLista'
    tabla.appendChild(body);

    for (let i = 0; i < list.length; i++) {
        list[i].id = i + 1
    }

    list.forEach(entry => {
        const row = document.createElement(`tr`);
        body.appendChild(row);
        
        Object.entries(entry).forEach(([titulo, value ]) => {
            if (titulo !== 'path') {
                const cell = document.createElement(`td`);
                    cell.textContent = value;
                    row.appendChild(cell);
            };
        })
        
    });
}

/* ----------------------------------------------------------- */

function botonHistorial() {
    document.getElementById('historial').onclick = function () {
        verHistorial()
    }
}

/* ----------------------------------------------------------- */

function eliminarElementos() {
    const tabla = document.getElementById('reproduccion')
    tabla.removeChild(tabla.firstChild);
    
    document.getElementById('cuerpoLista').remove()

    document.getElementById('medio').remove()

    document.getElementById('export').classList.add('noMostrar')
}