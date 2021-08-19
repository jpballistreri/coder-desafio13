import express from "express";
import path from "path";
import routerApi from "./routes/api.js";
import web from "./routes/web.js";
import fs from "fs";

import * as http from "http";
import io from "socket.io";

const util = require("util");

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

  socket.on("nuevo-producto", () => {
    console.log("nuevo producto!!!");
    const productos = fs.readFile(
      "./productos.json",
      "utf-8",
      async function (err, data) {
        if (err) {
          console.log(err);
          return [];
        } else {
          console.log("\n\nUn cliente ha ingresado un producto");
          console.log(`ID DEL SOCKET DEL CLIENTE => ${socket.client.id}`);
          console.log(`ID DEL SOCKET DEL SERVER => ${socket.id}`);
          const arrayProductos = JSON.parse(data);
          //console.log(arrayProductos);
          myWSServer.emit("listaProductos", arrayProductos);
        }
      }
    );
  });

  socket.on("askData", () => {
    const productos = fs.readFile(
      "./productos.json",
      "utf-8",
      function (err, data) {
        if (err) {
          console.log(err);
          return [];
        }

        const arrayProductos = JSON.parse(data);
        socket.emit("listaProductos", arrayProductos);
      }
    );
    console.log("ME LLEGO DATA");
  });
});
