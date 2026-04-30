<h1 align="center">📟 Buscaminas</h1> 

Juego web clásico "BuscaMinas" con interfaz moderna, soporte táctil, sonidos y ranking local.

- **Tipo:** Juego web estático (frontend puro)
- **Objetivo:** Encontrar todas las celdas seguras sin detonar minas
- **Interacción:** Click izquierdo = descubrir, click derecho / pulsación larga = marcar bandera

## ✨ Características principales

- 🎮 **Tres niveles preconfigurados:** Chill (8x8, 10 minas), Peligro (10x10, 20 minas), Minado (12x12, 34 minas).
- 🔊 **Efectos sonoros:** Sonidos para click, descubrir, bandera, victoria y derrota.
- 🏆 **Ranking local:** Guarda puntajes en `localStorage` y permite ordenar por puntaje o fecha.
- 📱 **Soporte táctil:** Pulsación larga en dispositivos touch para marcar banderas.
- ⚡ **Responsive:** Diseño adaptable a móviles y escritorio.
- ✉️ **Validaciones y contacto:** Formulario de contacto con validación de campos.

## 🛠️ Tecnologías

- HTML5
- CSS3 (responsive)
- JavaScript (ES5/ES6)

## 📁 Estructura del proyecto

```text
Juego-BuscaMinas-Web/
├── index.html
├── contacto.html
├── README.md
├── assets/
│   ├── sonido_click.mp3
│   ├── sonido_descubrir.mp3
│   ├── sonido_perdedor.mp3
│   ├── sonido_ganador.mp3
│   └── bomb icono.ico
├── css/
│   ├── reset.css
│   ├── layout.css
│   ├── style.css
│   └── contacto.css
├── javascript/
│   ├── general.js
│   ├── juego.js
│   └── contacto.js
└── README.md
```

### 📌 Archivos clave

- Interfaz principal: [index.html](index.html)
- Formulario de contacto: [contacto.html](contacto.html)
- Lógica del juego: [javascript/juego.js](javascript/juego.js)
- Funciones UI y ranking: [javascript/general.js](javascript/general.js)
- Validación de contacto: [javascript/contacto.js](javascript/contacto.js)
- Estilos principales: [css/style.css](css/style.css)

## 🔧 Módulos funcionales

- **Game core**: generación del tablero, colocación de minas, contador de minas alrededor, apertura recursiva de celdas, detección de victoria/derrota y temporizador.
- **UI & utils**: modales (ajustes, ranking), gestión de sonido, persistencia y ordenamiento del ranking en `localStorage`.
- **Contacto**: validaciones del formulario y apertura de `mailto:`.
- **Estilos**: reset, layout global y estilos específicos del juego y formulario.

## ▶️ Cómo ejecutar

```bash
# con Python 3
python -m http.server 8000

# o con Node.js (si tienes http-server instalado)
npx http-server -p 8000

# Luego abrir http://localhost:8000.
```

## 🕹️ Controles y jugabilidad

- Click izquierdo: descubrir celda
- Click derecho / pulsación larga: marcar/desmarcar bandera
- El primer click nunca cae en una mina (el tablero se regenera hasta que la primera jugada sea segura).
- Al ganar se guarda el puntaje en `localStorage` con nombre, tiempo y nivel.

---

<h3 align="center">Última actualización: Julio 2026 </h3>