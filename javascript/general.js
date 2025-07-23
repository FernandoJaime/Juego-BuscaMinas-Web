"use strict";

// Funcion para mostrar el modal de ajustes
function mostrarAjustes() {
  document.getElementById('modal-ajustes').style.display = 'block'
}

document.getElementById('btn-ajustes').addEventListener('click', mostrarAjustes)



document.getElementById('btn-contacto').addEventListener('click', function () {
  window.location.href = 'contacto.html'
})

// Mostrar el ranking en el modal
function mostrarRanking() {
  var modal = document.getElementById('modal-ranking');
  var tbody = document.querySelector('#tabla-ranking tbody');
  var rankingVacio = document.getElementById('ranking-vacio');
  var ranking = [];
  try {
      ranking = JSON.parse(localStorage.getItem('buscaminas_ranking')) || [];
  } catch (e) {
      ranking = [];
  }

  // Obtener valor del filtro (por ejemplo, desde un select con id 'filtro-selector')
  var filtro = document.getElementById('filtro-selector').value;

  // Ordenar según filtro seleccionado
  ranking.sort(function(a, b) {
      if (filtro === 'puntaje-desc') return b.puntos - a.puntos;
      if (filtro === 'puntaje-asc') return a.puntos - b.puntos;
      if (filtro === 'fecha-desc') return new Date(b.fecha) - new Date(a.fecha);
      if (filtro === 'fecha-asc') return new Date(a.fecha) - new Date(b.fecha);
      return 0; // Por defecto sin orden
  });

  tbody.innerHTML = '';
  if (ranking.length === 0) {
      rankingVacio.style.display = 'block';
      return;
  } else {
      rankingVacio.style.display = 'none';
  }
  for (var i = 0; i < ranking.length; i++) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + (i+1) + '</td>' +
                     '<td>' + ranking[i].nombre + '</td>' +
                     '<td>' + ranking[i].puntos + '</td>' +
                     '<td>' + ranking[i].tiempo + 's</td>' +
                     '<td>' + ranking[i].fecha + '</td>';
      tbody.appendChild(tr);
  }
}


// Evento para abrir el modal de ranking
var btnRanking = document.querySelector('.fa-trophy').closest('button');
btnRanking.addEventListener('click', function() {
    mostrarRanking();
    var modal = document.getElementById('modal-ranking');
    modal.classList.remove('modal-ranking-oculto');
    modal.classList.add('modal-ranking-visible');
});
// Evento para cerrar el modal de ranking
var btnCerrarRanking = document.getElementById('cerrar-modal-ranking');
btnCerrarRanking.addEventListener('click', function() {
    var modal = document.getElementById('modal-ranking');
    modal.classList.remove('modal-ranking-visible');
    modal.classList.add('modal-ranking-oculto');
});

document.getElementById('filtro-selector').addEventListener('change', mostrarRanking);