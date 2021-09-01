import socketIo from "socket.io";
import fs from "fs";
import moment from "moment";

class SocketService {
  initWsService(server) {
    if (!this.myWSServer) {
      this.myWSServer = socketIo(server);
      this.myWSServer.on("connection", (socket) => {
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
                console.log(arrayProductos);

                this.myWSServer.emit("array-productos", arrayProductos);
              }
            }
          );
        });

        socket.on("nuevo-mensaje", (email, texto) => {
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
            const data = fs.readFile(
              "./mensajes.json",
              "utf-8",
              async function (err, data) {
                if (err) {
                  if (err.errno == -2) {
                    //Si el archivo no existe, se crea con el nuevo mensaje
                    let arrayMensajes = JSON.parse("[\n]");

                    const nuevoMensaje = {
                      email: email,
                      date: `${moment()
                        .subtract(10, "days")
                        .calendar()} ${moment().format("LTS")}`,
                      texto: texto,
                    };

                    arrayMensajes.push(nuevoMensaje);

                    //Guarda el archivo nuevo con el Mensaje
                    fs.writeFile(
                      "./mensajes.json",
                      JSON.stringify(arrayMensajes, null, "\t"),
                      (err) => {
                        if (err) {
                          return res.status(400).json({
                            msj: err,
                          });
                        }
                        this.myWSServer.emit("mensaje-enviado", arrayMensajes);
                      }
                    );
                  }
                }
                //Si el archivo existe...
                else {
                  let arrayMensajes = JSON.parse(data);
                  const nuevoMensaje = {
                    email: email,
                    date: `${moment()
                      .subtract(10, "days")
                      .calendar()} ${moment().format("LTS")}`,
                    texto: texto,
                  };
                  arrayMensajes.push(nuevoMensaje);
                  //Guarda el archivo nuevo con el mensaje
                  fs.writeFile(
                    "./mensajes.json",
                    JSON.stringify(arrayMensajes, null, "\t"),
                    (err) => {
                      if (err) {
                        return res.status(400).json({
                          msj: err,
                        });
                      }
                      console.log(arrayMensajes);
                      myWSServer.emit("mensaje-enviado", arrayMensajes);
                    }
                  );
                }
              }
            );
          }
        });

        socket.on("get-productos", () => {
          const productos = fs.readFile(
            "./productos.json",
            "utf-8",
            function (err, data) {
              if (err) {
                console.log(err);
                return [];
              }

              const arrayProductos = JSON.parse(data);
              socket.emit("array-productos", arrayProductos);
            }
          );
          console.log("ME LLEGO DATA");
        });

        socket.on("get-mensajes", () => {
          const mensajes = fs.readFile(
            "./mensajes.json",
            "utf-8",
            (err, data) => {
              if (err) {
                return [];
              }
              const arrayMensajes = JSON.parse(data);
              socket.emit("array-mensajes", arrayMensajes);
            }
          );
        });
      });
    }
    return this.myWSServer;
  }
  getServer() {
    return this.myWSServer;
  }
}

export const socketService = new SocketService();
