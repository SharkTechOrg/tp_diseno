// Selección de elementos del DOM
const formularioEl = document.getElementById('formulario');
const inputEl = document.getElementById('api-url');
const notificacionEL = document.getElementById('notificacion');
const resultadoEl = document.getElementById('resultado');
const btnConsultarEl = document.getElementById('btnConsultar');
const btnDescargarEl = document.getElementById('btnDescargar');

//  Variables globales
let data = null; // Almacena los datos de la API

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
  notificacionEL.className = `alert alert-${tipo} d-block`;
  notificacionEL.textContent = mensaje;

  setTimeout(() => {
    notificacionEL.className = 'alert d-none';
  }, 5000); // Oculta la notificación después de 5 segundos
}

async function obtenerDatosAPI(url) {
  try {
    btnConsultarEl.disabled = true; // Deshabilita el botón de consulta
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('No se pudieron obtener los datos.');
    }

    data = await response.json();
    resultadoEl.classList.remove('d-none')
    btnDescargarEl.classList.remove('d-none'); // Muestra el botón de Descargar
    mostrarNotificacion('Datos cargados correctamente.', 'success');
    mostrarResultado(data);
  } catch (error) {
    data = null;
    resultadoEl.classList.add('d-none')
    btnDescargarEl.classList.add('d-none'); // Oculta el botón de Descargar
    mostrarNotificacion(`Error al cargar los datos: ${error.message}`, 'danger');
    resultadoEl.innerHTML = '<p class="text-danger mb-0">No se pudieron obtener los datos.</p>';

  } finally {
    btnConsultarEl.disabled = false; // Habilita el botón de consulta
  }
}

// Evento de envío del formulario
formularioEl.addEventListener('submit', (e) => {
  e.preventDefault(); // Evita la recarga de la página

  const url = inputEl.value.trim();

  // Validar que la URL no esté vacía y sea válida
  if (!url) {
    mostrarNotificacion('Por favor, ingresa una URL válida.', 'warning');
    return;
  }

  // Consumir la API
  obtenerDatosAPI(url);
});

function mostrarResultado(data) {
  resultadoEl.innerHTML = `
  <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Titulo</th>
      <th scope="col">Contenido</th>
      <th scope="col">ID usuario</th>
    </tr>
  </thead>
  <tbody>
    ${
      data.map((item)=> `<tr>
      <th scope="row">${item.id}</th>
      <td>${item.title}</td>
      <td>${item.body}</td>
      <td>${item.userId}</td>
    </tr>`
      ).join("")
    }
  </tbody>
</table>`
}


// Evento click en el botón de Descargar (formato JSON)
btnDescargarEl.addEventListener('click', () => {
  if (!data) {
    mostrarNotificacion('No hay datos para Descargar.', 'warning');
    return; // termina la ejecución de la función
  }

  const dataStr = JSON.stringify(data, null, 2); // Convierte el objeto a una cadena de texto
  const blob = new Blob([dataStr], { type: 'application/json' }); // Crea un objeto Blob
  // que es un objeto Blob?
  // basicamente es un archivo en memoria
  const url = URL.createObjectURL(blob); // Crea una URL para el objeto Blob

  // En caso que se quiera abrir en otra pantalla para Descargar
  // Abre una nueva ventana con la URL del objeto Blob
  // window.open(url, '_blank');


  const a = document.createElement('a'); // crea un elemento <a> que nos servirá para descargar el archivo
  a.href = url; // Asigna la URL al atributo href del elemento <a>, para que apunte al archivo
  a.download = 'resultados.json'; // Asigna el nombre del archivo a descargar
  a.click(); // Simulamos un click en el elemento <a> para que se descargue el archivo
  // el elemento <a> no se agrega al DOM, solo se usa para descargar el archivo
});
