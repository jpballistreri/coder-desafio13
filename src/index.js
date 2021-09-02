import express from "express";
import path from "path";
import routerApi from "./routes/api.js";
import web from "./routes/web.js";
import moment from "moment";
import { DBService, DBMensajesSqlite } from "./services/db";

import * as http from "http";
import io from "socket.io";

DBService.init();
DBMensajesSqlite.init();

/** INICIALIZACION API con EXPRESS */
const app = express();
const puerto = 8080;

const publicPath = path.resolve(__dirname, "../public");
app.use(express.static(publicPath));

app.set("view engine", "pug");
const viewsPath = path.resolve(__dirname, "../views/");
app.set("views", viewsPath);

const myServer = http.Server(app);

myServer.listen(puerto, () => console.log("Server up en puerto", puerto));

myServer.on("error", (err) => {
  console.log("ERROR ATAJADO", err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*** DEFINICION ROUTERS ***/

app.use("/api", routerApi);
app.use("/productos", web);

const myWSServer = io(myServer);
myWSServer.on("connection", function (socket) {
  console.log("\n\nUn cliente se ha conectado");
  console.log(`ID DEL SOCKET DEL CLIENTE => ${socket.client.id}`);
  console.log(`ID DEL SOCKET DEL SERVER => ${socket.id}`);

  socket.on("nuevo-producto", async () => {
    console.log("Nuevo Producto!");
    const productos = await DBService.get("productos");
    myWSServer.emit("array-productos", productos);
  });

  socket.on("nuevo-mensaje", async (email, texto) => {
    function validateEmail(email) {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

    if (validateEmail(email) == false) {
      socket.emit("mensaje-error", {
        msj: "Por favor, ingrese un Email válido.",
      });
    } else {
      ////Guarda mensaje
      const nuevoMensaje = {
        email: email,
        date: `${moment().subtract(10, "days").calendar()} ${moment().format(
          "LTS"
        )}`,
        texto: texto,
      };
      await DBMensajesSqlite.create("mensajes", nuevoMensaje);
      const arrayMensajes = await DBMensajesSqlite.get("mensajes");
      myWSServer.emit("array-mensajes", arrayMensajes);
    }
  });

  socket.on("get-productos", async () => {
    const productos = await DBService.get("productos");
    socket.emit("array-productos", productos);
  });

  socket.on("get-mensajes", async () => {
    const mensajes = await DBMensajesSqlite.get("mensajes");
    socket.emit("array-mensajes", mensajes);
  });
});
