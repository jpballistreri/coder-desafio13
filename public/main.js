/////////////////////
////////////WEBSOCKETS

const socket = io.connect("http://localhost:8080", { forceNew: true });

// Cuando arrancamos pedimos la data que hay actualmente enviando un socket
socket.emit("get-productos");
socket.emit("get-mensajes");

function limpiarForms() {
  document.getElementById("titulo_producto").value = "";
  document.getElementById("precio_producto").value = "";
  document.getElementById("thumbnail").value = "";
  document.getElementById("mensajeEmail").value = "";
  document.getElementById("mensajeTexto").value = "";
}
//Limpia los formularios al cargar la pagina
window.onload = function () {
  limpiarForms();
};

function renderMensajes(data) {
  let html = data
    .map(function (elem, index) {
      return `<p>
              <span class="messageEmail">${elem.email}</span>  
              <span class="messageDate">${elem.date}</span>
              <span class="messageText">${elem.texto}</span>
              </p>`;
    })
    .join(" ");
  document.getElementById("mensajes").innerHTML = html;
}

function renderProductos(data) {
  data.reverse();

  let html = data
    .map(function (elem, index) {
      return `
                <tr>
                  <td>${elem.title}</td>
                  <td>${elem.price}</td>
                  <td><img src="${elem.thumbnail}"></td>
                </tr>
              
              `;
    })
    .join(" ");

  document.getElementById("productos").innerHTML = html;
}

socket.on("array-productos", function (data) {
  console.log("RECIBI LISTA");
  console.log(data);
  renderProductos(data);
});
socket.on("array-mensajes", function (data) {
  console.log("RECIBI MENSAJES");
  console.log(data);
  renderMensajes(data);
});
socket.on("mensaje-error", (res) => {
  alert(res.msj);
});
socket.on("mensaje-enviado", (data) => {
  renderMensajes(data);
});

//////////////////////77
////FORMULARIO DE INGRESO PRODUCTO

//function limpiarMsjIngresoProducto() {
//  var mensaje = document.getElementById("msjIngresoProducto");
//
//  setTimeout(() => {
//    socket.emit("nuevo-producto");
//    mensaje.textContent = "";
//  }, 1500);
//}

function enviarFormulario(e) {
  e.preventDefault();
  let title = document.getElementById("titulo_producto").value;
  let price = Number(document.getElementById("precio_producto").value);
  let thumbnail = document.getElementById("thumbnail").value;
  //let mensaje = document.getElementById("msjIngresoProducto");

  fetch("/api/productos/guardar", {
    method: "POST",
    body: JSON.stringify({ title, price, thumbnail }),
    headers: { "content-type": "application/json" },
  })
    .then((res) => res.json())
    .then((res) => (socket.emit("nuevo-producto"), alert(res.msj)));
  console.log(JSON.stringify({ title, price, thumbnail }));
}
/////////////////
///////////FORMULARIO INGRESO MENSAJE
function enviarMensaje(e) {
  e.preventDefault();
  let email = document.getElementById("mensajeEmail").value;
  let texto = document.getElementById("mensajeTexto").value;
  console.log(email, texto);
  socket.emit("nuevo-mensaje", email, texto);
  document.getElementById("mensajeTexto").value = "";
}
