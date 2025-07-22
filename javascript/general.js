"use strict";

// Funcion para mostrar el modal de ajustes
function mostrarAjustes() {
  document.getElementById('modal-ajustes').style.display = 'block'
}

document.getElementById('btn-ajustes').addEventListener('click', mostrarAjustes)

// Mostrar el ranking en el modal (Nombre, Nivel, Fecha, Tiempo)
function mostrarRanking() {
  const modal = document.getElementById('modal-ranking')
  const tbody = document.querySelector('#tabla-ranking tbody')
  const rankingVacio = document.getElementById('ranking-vacio')
  let ranking = JSON.parse(localStorage.getItem('buscaminas_ranking') || '[]') //Obtenemos el ranking del localStorage
  tbody.innerHTML = ''
  if (ranking.length === 0) {
    rankingVacio.classList.remove('ranking-vacio') //Si no hay ranking, mostramos el mensaje de que no hay partidas ganadas
    return
  } else {
    rankingVacio.classList.add('ranking-vacio') //Si hay ranking, ocultamos el mensaje
  }
  ranking.forEach((item, idx) => {
    const tr = document.createElement('tr')
    tr.innerHTML = `<td>${idx + 1}</td><td>${item.nombre}</td><td>${item.nivel || ''}</td><td>${item.fecha || ''}</td><td>${item.tiempo}</td>`
    tbody.appendChild(tr)
  })
}

// Evento para abrir/cerrar el ranking
const btnRanking = document.querySelector('.fa-trophy').closest('button') //Obtenemos elemento
btnRanking.addEventListener('click', function () {
  mostrarRanking()
  document.getElementById('modal-ranking').classList.remove('modal-ranking')
  document.getElementById('modal-ranking').classList.add('modal-nombre-inicial')
})
document.getElementById('cerrar-modal-ranking').addEventListener('click', function () {
  document.getElementById('modal-ranking').classList.remove('modal-nombre-inicial')
  document.getElementById('modal-ranking').classList.add('modal-ranking')
})

document.getElementById('btn-contacto').addEventListener('click', function () {
  window.location.href = 'contacto.html'
})