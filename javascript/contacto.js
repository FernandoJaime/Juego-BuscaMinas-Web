"use strict";

// Volver al index
document.getElementById('btn-volver-contacto').addEventListener('click', function () {
    window.location.href = 'index.html'
})

function validarNombre(nombre) {
    return nombre.length >= 3 && !/\d/.test(nombre);
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarDescripcion(descripcion) {
    return descripcion.trim().length >= 5;
}

document.getElementById('form-contacto').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que el formulario se envíe

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    const errorNombre = document.getElementById('error-nombre');
    const errorEmail = document.getElementById('error-email');
    const errorMensaje = document.getElementById('error-mensaje');
    
    errorNombre.textContent = '';
    errorEmail.textContent = '';
    errorMensaje.textContent = '';

    let esValido = true;

    if (!nombre || !email || !mensaje) {
        errorMensaje.textContent = 'Hay campos vacios';
        esValido = false;
    }
    else {
        if (!validarNombre(nombre)) {
            errorNombre.textContent = 'Al menos 3 letras y sin numeros';
            esValido = false;
        }
    
        if (!validarEmail(email)) {
            errorEmail.textContent = 'Email invalido';
            esValido = false;
        }
    
        if (!validarDescripcion(mensaje)) {
            errorMensaje.textContent = 'Al menos 5 caracteres';
            esValido = false;
        }
    }
    
    if (esValido) {
        const asunto = encodeURIComponent(`Contacto desde BuscaMinas FM - ${nombre}`);
        const cuerpo = encodeURIComponent(`${mensaje}\n\n ${email}\nSaludos cordiales!\n${nombre}`);
        const destinatario = 'fernando.jaime@alumnos.uai.edu.ar';

        window.location.href = `mailto:${destinatario}?subject=${asunto}&body=${cuerpo}`;

        // Limpio los campos
        document.getElementById('nombre').value = '';
        document.getElementById('email').value = '';
        document.getElementById('mensaje').value = '';
    }
});
