// Variables globales
let filas = 20
let columnas = 20
let lado = 30

generarTablero()

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
}