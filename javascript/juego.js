// Variables globales
"use strict";
var filas = 8
var columnas = 8
var lado = 30
var timer = null
var segundos = 0
var minas = 10
var marcas = 0
var jugando = true
var juegoIniciado = false
var tablero = []
var nombreJugador = ''

function jugar() {
    reiniciarVariables()
    generarTablero()
    generarTableroJuego()
    eventos()
    actualizarTablero()
    iniciarTimer()
}

// Evento para iniciar un nuevo juego
document.getElementById("juego-nuevo").addEventListener("click", jugar)

// Función para iniciar el timer
function iniciarTimer() {
    if (timer) clearInterval(timer)
    segundos = 0
    document.getElementById('timer').textContent = '000'
    timer = setInterval(function () {
        segundos++
        document.getElementById('timer').textContent = segundos.toString().padStart(3, '0')
    }, 1000)
}

// Función para reiniciar las letiables del juego
function reiniciarVariables() {
    marcas = 0
    jugando = true
    juegoIniciado = false
}

// Función para generar el tablero HTML
function generarTablero() {
    var html = ""
    for (var f = 0; f < filas; f++) {
        html += `<tr>`
        // Generación de cada uno de los elementos de la matriz y se les asigna una coordenada
        for (var c = 0; c < columnas; c++) {
            html += `<td id="celda-${c}-${f}" style="width:${lado}px; height:${lado}px">` // Dimensiones de cada celda (ancho y alto)
            html += `</td>`
        }
        html += `</tr>`
    }

    var tablero = document.getElementById("tablero-de-juego")
    tablero.innerHTML = html
    tablero.style.width = columnas * lado + "px" // Ancho del tablero (columnas * lado)
    tablero.style.height = filas * lado + "px" // Alto del tablero (filas * lado)
    tablero.style.background = "slategray"

    iniciarTimer()
}

// Función para limpiar el tablero
function limpiarTablero() {
    tablero = []
    for (var c = 0; c < columnas; c++) {
        tablero.push([])
    }
}

// Función para poner las minas en el tablero
function ponerMinas() {
    for (var i = 0; i < minas; i++) {
        var c
        var f

        do {
            c = Math.floor(Math.random() * columnas) // Genera una columna aleatoria en el tablero
            f = Math.floor(Math.random() * filas) // Genera una fila aleatoria en el tablero
        } while (tablero[c][f]);

        tablero[c][f] = { valor: -1 } // Definimos valor de la celda como -1 para las minas
    }
}

// Función para contar las minas alrededor de cada celda
function contadorDeMinas() {
    for (var f = 0; f < filas; f++) {
        for (var c = 0; c < columnas; c++) {
            if (!tablero[c][f]) {
                var contador = 0
                // Se recorren celdas alrededor de la celda actual
                for (var i = -1; i <= 1; i++) {
                    for (var j = -1; j <= 1; j++) {
                        if (i == 0 && j == 0) { // Si la celda es la misma, se salta
                            continue
                        }
                        try {
                            if (tablero[c + i][f + j].valor == -1) { // Si la celda tiene una mina, se incrementa el contador
                                contador++
                            }
                        } catch (e) { }
                    }
                }
                tablero[c][f] = {
                    valor: contador
                }
            }
        }
    }
}

// Funcion para generar el tablero de juego para evitar interferencias con posibles partidas pasadas
function generarTableroJuego() {
    limpiarTablero()
    ponerMinas()
    contadorDeMinas()
}

function eventos() {
    for (var f = 0; f < filas; f++) {
        for (var c = 0; c < columnas; c++) {
            asignarEventos(c, f)
        }
    }
}

// Funcion para actualizar el panel de minas 
function actualizarPanelMinas() {
    var panel = document.getElementById("minas")
    panel.innerHTML = minas - marcas
}

// Funcion para verificar si el jugador ha ganado, si todas las minas estan marcadas y que las demás estan descubiertas
function verificarGanador() {
    for (var f = 0; f < filas; f++) {
        for (var c = 0; c < columnas; c++) {
            if (tablero[c][f].estado != `descubierto`) { // Si la mina está descubierta
                if (tablero[c][f].valor == -1) { // Y si es una mina
                    continue
                } else { // Si hay una celda cubierta, que no sea una mina, aun no gano
                    return
                }
            }
        }
    }
    // Si la comprobacion es exitosa (todas las celdas cubiertas son minas), entonces gano
    var tableroHTML = document.getElementById("tablero-de-juego")
    tableroHTML.style.background = "green"
    jugando = false
    // Guardar en ranking con nivel y fecha
    const tiempo = segundos.toString().padStart(3, '0')
    guardarEnRanking(nombreJugador, segundos, obtenerNombreNivel())
    // Mostrar mensaje de victoria con el nombre
    const alerta = document.getElementById('alerta-perdedor')
    if (alerta) {
        alerta.classList.remove('derrota')
        alerta.classList.add('victoria')
        alerta.classList.remove('alerta-oculta')
        alerta.querySelector('.alerta-contenido').innerHTML = `
        <h2>¡Felicidades, ${nombreJugador}!</h2>
        <p>¡Has ganado!</p>
        <p>⏱️ Tiempo: <strong>${tiempo} s</strong></p>
        <p>🚩 Banderas puestas: <strong>${marcas}</strong></p>
        <button id="btn-reintentar">Jugar de nuevo</button>
      `
        const btnReintentar = document.getElementById('btn-reintentar')
        if (btnReintentar) {
            btnReintentar.addEventListener('click', function () {
                alerta.classList.add('alerta-oculta')
                jugar()
            })
        }
    }
}

// Funcion para verificar si el jugador ha perdido, si descubre una mina
function verificarPerdedor() {
    for (var f = 0; f < filas; f++) {
        for (var c = 0; c < columnas; c++) {
            if (tablero[c][f].valor == -1) {
                if (tablero[c][f].estado == `descubierto`) {
                    var tableroHTML = document.getElementById("tablero-de-juego")
                    tableroHTML.style.background = "red"
                    jugando = false
                    if (timer) clearInterval(timer)
                    const alerta = document.getElementById('alerta-perdedor')
                    if (alerta) {
                        alerta.classList.remove('victoria')
                        alerta.classList.add('derrota')
                        const tiempo = segundos.toString().padStart(3, '0')
                        alerta.querySelector('.alerta-contenido').innerHTML = `
                <h2>¡${nombreJugador}, has perdido!</h2>
                <p>⏱️ Tiempo: <strong>${tiempo} s</strong></p>
                <p>🚩 Banderas puestas: <strong>${marcas}</strong></p>
                <button id="btn-reintentar">Reintentar</button>
              `
                        setTimeout(function () {
                            alerta.classList.remove('alerta-oculta')
                            const btnReintentar = document.getElementById('btn-reintentar')
                            if (btnReintentar) {
                                btnReintentar.addEventListener('click', function () {
                                    alerta.classList.add('alerta-oculta')
                                    jugar()
                                })
                            }
                        }, 1000) // 1 segundo de delay para que el usuario pueda ver las minas
                    }
                }
            }
        }
    }
    if (jugando) {
        return
    }
    // Mostrar las demás minas que están ocultas total ya perdio
    for (var f = 0; f < filas; f++) {
        for (var c = 0; c < columnas; c++) {
            if (tablero[c][f].valor == -1) {
                var celda = document.getElementById(`celda-${c}-${f}`)
                if (tablero[c][f].estado !== "descubierto") {
                    celda.innerHTML = `<i class="fas fa-bomb"></i>`
                    celda.style.color = "black"
                } else {
                    celda.innerHTML = `<i class="fas fa-bomb"></i>`
                    celda.style.color = "black"
                }
            }
        }
    }
}

// Funcion para actualizar el tablero de juego
function actualizarTablero() {
    for (var f = 0; f < filas; f++) {
        for (var c = 0; c < columnas; c++) {
            var celda = document.getElementById(`celda-${c}-${f}`)
            if (tablero[c][f].estado == "descubierto") { // Si la celda esta descubierta
                celda.style.boxShadow = "none"
                celda.style.background = "#cfd8dc" // Fondo gris azulado suave para celdas abiertas
                celda.style.color = "#263238" // Texto oscuro para buena visibilidad
                switch (tablero[c][f].valor) {
                    case -1: // Si es una mina
                        celda.innerHTML = `<i class="fas fa-bomb"></i>` // Muestro la mina
                        celda.style.color = "black"
                        celda.style.background = "red"
                        break;
                    case 0: // Si es un 0, no hago nada
                        break
                    default:
                        celda.innerHTML = tablero[c][f].valor // Muestro el valor de la celda
                        break;
                }
            }
            if (tablero[c][f].estado == "marcado") { // Si la celda esta marcada
                celda.innerHTML = `<i class="fas fa-flag"></i>` // Bandera Font Awesome 6+
                celda.style.background = `cadetblue`
                celda.style.color = "#fff"
            }
            if (tablero[c][f].estado == undefined) { // Si la celda esta vacia
                celda.innerHTML = ``
                celda.style.background = ``
            }
        }
    }
    verificarGanador()
    verificarPerdedor()
    actualizarPanelMinas()
}

// Funcion para abrir las celdas que rodean a la celda a la que se le dio click
function abrirArea(c, f) {
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) {
                continue // Para evitar que se encierre en un bucle infinito
            }

            try { // Para evitar las posiciones negativas
                if (tablero[c + i][f + j].estado != "descubierto") {
                    if (tablero[c + i][f + j].estado != "marcado") {
                        tablero[c + i][f + j].estado = "descubierto" // Abro las celdas circundantes
                        if (tablero[c + i][f + j].valor == 0) { // Si la celda que se abre es otro 0, se le pasa la responsabilidad
                            abrirArea(c + i, f + j)
                        }
                    }
                }
            }
            catch (e) { }
        }
    }
}

// Funcion clic derecho y izquierdo para descubrir las celdas, o marcarlas con bandera
function click(c, f, me) {
    if (!jugando) {
        return
    }

    if (tablero[c][f].estado == "descubierto") { // Evito que las celdas descubiertas sean redescubiertas o marcadas
        return
    }

    switch (me.button) {
        case 0: // 0 click izquierdo
            if (tablero[c][f].estado == "marcado") { // la celda está protegida
                break
            }

            while (!juegoIniciado && tablero[c][f].valor == -1) { // Evito que la primera jugada sea en una mina
                generarTableroJuego()
            }

            tablero[c][f].estado = "descubierto"
            juegoIniciado = true // El jugador descubrio más de 1 celda

            if (tablero[c][f].valor == 0) { // Si acertamos en una celda que no tenga minas alrededor, entonces hay que destapar toda el área de ceros
                abrirArea(c, f)
            }
            break;

        case 1: // 1 click medio
            break;

        case 2: // 2 click derecho
            if (tablero[c][f].estado == "marcado") { // Si la celda está marcada, se desmarca
                tablero[c][f].estado = undefined
                marcas--
            }
            else { // Si la celda no está marcada, se marca
                if (marcas >= minas) {
                    break // No se pueden poner más banderas que minas
                }
                tablero[c][f].estado = "marcado"
                marcas++
            }
            break;

        default:
            break;
    }
    actualizarTablero() // Actualizo el tablero
}

// Funcion para asignar los eventos a las celdas del tablero (click izquierdo y derecho)
function asignarEventos(c, f) {
    var celda = document.getElementById(`celda-${c}-${f}`)

    celda.addEventListener("mouseup", function (me) {
        click(c, f, me)
    })

    celda.addEventListener("contextmenu", function (e) {
        e.preventDefault()
    })
}

// Funcion para seleccionar el nivel de juego
function seleccionarNivel(nivel) {
    switch (nivel) {
        case 'chill':
            filas = 8
            columnas = 8
            minas = 10
            break
        case 'peligro':
            filas = 10
            columnas = 10
            minas = 20
            break
        case 'minado':
            filas = 12
            columnas = 12
            minas = 34
            break
        case 'guerra':
            filas = 16
            columnas = 16
            minas = 60
            break
        case 'infierno':
            filas = 24
            columnas = 24
            minas = 99
            break
    }
    ocultarAjustes()
    jugar()
}

function ocultarAjustes() {
    document.getElementById('modal-ajustes').style.display = 'none'
}

document.getElementById('cerrar-modal-ajustes').addEventListener('click', ocultarAjustes)

// Cerrar modal al hacer clic fuera de él
window.onclick = function (event) {
    const modal = document.getElementById('modal-ajustes')
    if (event.target === modal) {
        ocultarAjustes()
    }
}

// Eventos para seleccionar el nivel de juego
document.getElementById('nivel-chill').addEventListener('click', function () {
    seleccionarNivel('chill')
});
document.getElementById('nivel-peligro').addEventListener('click', function () {
    seleccionarNivel('peligro')
});
document.getElementById('nivel-minado').addEventListener('click', function () {
    seleccionarNivel('minado')
});
document.getElementById('nivel-guerra').addEventListener('click', function () {
    seleccionarNivel('guerra')
});
document.getElementById('nivel-infierno').addEventListener('click', function () {
    seleccionarNivel('infierno')
});

// Funcion para devolver nivel que se juega (para ranking)
function obtenerNombreNivel() {
    if (filas === 8 && columnas === 8 && minas === 10) return 'Chill';
    if (filas === 10 && columnas === 10 && minas === 20) return 'Peligro';
    if (filas === 12 && columnas === 12 && minas === 34) return 'Minado';
    if (filas === 16 && columnas === 16 && minas === 60) return 'Guerra';
    if (filas === 24 && columnas === 24 && minas === 99) return 'Infierno';
    return 'Personalizado';
}

// Guardar partida ganada en el ranking (ahora con fecha y nivel)
function guardarEnRanking(nombre, tiempo, nivel) {
    let ranking = JSON.parse(localStorage.getItem('buscaminas_ranking') || '[]')
    const fecha = new Date().toLocaleDateString()
    ranking.push({ nombre, tiempo: Number(tiempo), nivel, fecha }) // Guardamos el ranking en el localStorage
    ranking = ranking.filter(r => r.nombre && r.tiempo > 0) // Validación para evitar errores inesperados o partidas sin tiempo
    ranking.sort((a, b) => a.tiempo - b.tiempo) // Ordenamos el ranking por tiempo
    localStorage.setItem('buscaminas_ranking', JSON.stringify(ranking))
}

// Lógica para el modal de nombre
window.addEventListener('DOMContentLoaded', function () {
    const modalNombre = document.getElementById('modal-nombre')
    const inputNombre = document.getElementById('input-nombre')
    const btnConfirmarNombre = document.getElementById('btn-confirmar-nombre')
    const nombreError = document.getElementById('nombre-error')

    // Bloquear el juego hasta que se ingrese un nombre válido
    function validarNombre(nombre) {
        return nombre && nombre.trim().length >= 3
    }

    btnConfirmarNombre.addEventListener('click', function () {
        const nombre = inputNombre.value.trim()
        if (validarNombre(nombre)) {
            nombreJugador = nombre
            modalNombre.classList.remove('modal-nombre-inicial')
            modalNombre.classList.add('modal-ranking')
            nombreError.classList.add('modal-nombre-error')
            jugar() // Iniciar el juego automáticamente
        } else {
            nombreError.classList.remove('modal-nombre-error')
        }
    })

    inputNombre.addEventListener('input', function () {
        if (validarNombre(inputNombre.value)) {
            nombreError.classList.add('modal-nombre-error')
        }
    })

    // Evitar que se cierre el modal con Escape o clic fuera
    modalNombre.addEventListener('click', function (e) {
        if (e.target === modalNombre) {
            inputNombre.focus()
        }
    })
    inputNombre.focus()
})

// Evento para reintentar un juego perdido
document.addEventListener('DOMContentLoaded', function () {
    const alerta = document.getElementById('alerta-perdedor')
    const btnReintentar = document.getElementById('btn-reintentar')
    if (btnReintentar) {
        btnReintentar.addEventListener('click', function () {
            alerta.classList.add('alerta-oculta')
            jugar()
        })
    }
})