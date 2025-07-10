// Variables globales
let filas = 20
let columnas = 20
let lado = 30
let timer = null // Variable para el timer
let segundos = 0 // Variable para el tiempo
let minas = filas * columnas * 0.1 //Agarramos el 10% de las celdas para las minas

generarTablero()

// Función para generar el tablero HTML
function iniciarTimer() {
    if (timer) clearInterval(timer)
    segundos = 0
    document.getElementById('timer').textContent = '000'
    timer = setInterval(() => {
        segundos++
        document.getElementById('timer').textContent = segundos.toString().padStart(3, '0')
    }, 1000)
}

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

function LimpiarTablero() {
  tablero = []
  for (let c = 0; c < columnas; c++) {
    tablero.push([])
  }
}
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

function ContadorDeMinas() {
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      if (!tablero[c][f]) 
      {
        let contador = 0
        //Se recorren celdas alrededor de la celda actual
        for (let i = -1; i <= 1; i++) { 
          for (let j = -1; j <= 1; j++) { 
            if (i == 0 && j == 0) { //Si la celda es la misma, se salta
              continue
            }
            try { 
              if (tablero[c + i][f + j].valor == -1) { //Si la celda tiene una mina, se incrementa el contador
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
