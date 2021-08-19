/////////////////////
////////////WEBSOCKETS

const socket = io.connect("http://localhost:8080", { forceNew: true });

// Cuando arrancamos pedimos la data que hay actualmente enviando un socket
socket.emit("askData");

function limpiarForm() {
  document.getElementById("titulo_producto").value = "";
  document.getElementById("precio_producto").value = "";
  document.getElementById("thumbnail").value = "";
}

window.onload = function () {
  limpiarForm();
};

function render(data) {
  data.reverse();

  var html = data
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

socket.on("listaProductos", function (data) {
  console.log("RECIBI LISTA");
  render(data);
});

//////////////////////77
////FORMULARIO DE INGRESO

function limpiarMensaje() {
  var mensaje = document.getElementById("mensaje");

  setTimeout(() => {
    socket.emit("nuevo-producto");
    mensaje.textContent = "";
  }, 1500);
}

function enviarFormulario(e) {
  e.preventDefault();
  var title = document.getElementById("titulo_producto").value;
  var price = Number(document.getElementById("precio_producto").value);
  var thumbnail = document.getElementById("thumbnail").value;
  var mensaje = document.getElementById("mensaje");

  fetch("/api/productos/guardar", {
    method: "POST",
    body: JSON.stringify({ title, price, thumbnail }),
    headers: { "content-type": "application/json" },
  })
    .then((res) => res.json())
    .then((res) => (mensaje.innerText = res.msj), limpiarMensaje());
  console.log(JSON.stringify({ title, price, thumbnail }));
}
