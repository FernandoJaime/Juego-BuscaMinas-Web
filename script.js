// Variables globales
let filas = 20
let columnas = 20
let lado = 30
let timer = null // Variable para el timer
let segundos = 0 // Variable para el tiempo
let minas = filas * columnas * 0.1 // Agarramos el 10% de las celdas para las minas
let marcas = 0 
let jugando = true 
let juegoIniciado = false
let tablero = [] // Variable global para el tablero

function jugar() {
  generarTablero()
  ponerMinas()
  contadorDeMinas()
  eventos()
  iniciarTimer()
}
// Función para iniciar el timer
function iniciarTimer() {
    if (timer) clearInterval(timer)
    segundos = 0
    document.getElementById('timer').textContent = '000'
    timer = setInterval(() => {
        segundos++
        document.getElementById('timer').textContent = segundos.toString().padStart(3, '0')
    }, 1000)
}

// Función para generar el tablero HTML
function generarTablero() {
    let html = ""
    for (let f = 0; f < filas; f++) { 
      html += `<tr>` 
      // Generación de cada uno de los elementos de la matriz y se les asigna una coordenada
      for (let c = 0; c < columnas; c++) { 
        html += `<td id="celda-${c}-${f}" style="width:${lado}px; height:${lado}px">` // Dimensiones de cada celda (ancho y alto)
        html += `</td>`
      }
      html += `</tr>`
    }
    
    let tablero = document.getElementById("tablero-de-juego")
    tablero.innerHTML = html
    tablero.style.width = columnas * lado + "px" // Ancho del tablero (columnas * lado)
    tablero.style.height = filas * lado + "px" // Alto del tablero (filas * lado)
    tablero.style.background = "slategray" 
    
    iniciarTimer()
    
    // Actualizar el contador de minas en el HTML
    document.getElementById('minas').textContent = minas.toString().padStart(3, '0')
}

// Función para limpiar el tablero
function limpiarTablero() {
  tablero = []
  for (let c = 0; c < columnas; c++) {
    tablero.push([])
  }
}

// Función para poner las minas en el tablero
function ponerMinas() {
  for (let i = 0; i < minas; i++) {
    let c
    let f

    do {
      c = Math.floor(Math.random() * columnas) // Genera una columna aleatoria en el tablero
      f = Math.floor(Math.random() * filas) // Genera una fila aleatoria en el tablero
    } while (tablero[c][f]); 

    tablero[c][f] = {valor: -1} //Definimos valor de la celda como -1 para las minas
  }
}

// Función para contar las minas alrededor de cada celda
function contadorDeMinas() {
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      if (!tablero[c][f]) 
      {
        let contador = 0
        // Se recorren celdas alrededor de la celda actual
        for (let i = -1; i <= 1; i++) { 
          for (let j = -1; j <= 1; j++) { 
            if (i == 0 && j == 0) { // Si la celda es la misma, se salta
              continue
            }
            try { 
              if (tablero[c + i][f + j].valor == -1) { // Si la celda tiene una mina, se incrementa el contador
                contador++
              }
            } catch (e) {}
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

// Funcion para abrir las celdas que rodean a la celda a la que se le dio click
function abrirArea(c, f) {
  for (let i = -1; i <= 1; i++) { 
    for (let j = -1; j <= 1; j++) { 
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
      catch (e) {}
    }
  }
}

// Funcion para añadir los eventos a cada una de las celdas
function eventos() {
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      let celda = document.getElementById(`celda-${c}-${f}`)
      
      celda.addEventListener("dblclick", function(me) {
        dobleClick(celda, c, f, me)
      })
      
      celda.addEventListener("mouseup", function(me) {
        click(celda, c, f, me)
      })
    }
  }
}

// Funcion clic derecho y izquierdo para descubrir las celdas, o marcarlas con bandera
function click(celda, c, f, me) {
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
        tablero[c][f].estado = "marcado"
        marcas++
      }
      break;
    
    default:
      break;
  }
  refrescarTablero() // Actualizo el tablero
}

// Funcion para doble click para destapar las celdas que rodean a la celda a la que se le dio doble clic
function dobleClick(celda, c, f, me) {
  if (!jugando) {
    return
  }
  abrirArea(c, f)
  refrescarTablero() 
}