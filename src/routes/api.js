import express from "express";
import fs from "fs";

const router = express.Router();

router.get("/productos/listar", (req, res) => {
  const data = fs.readFile("./productos.json", "utf-8", function (err, data) {
    if (err) {
      if (err.errno == -2) {
        return res.status(400).json({
          error:
            "No existe archivo/db, cargar un producto para crear el archivo inicial de productos.",
        });
      } else {
        res.send(err);
      }
    }
    let arrayProductos = JSON.parse(data);

    if (arrayProductos.length == 0) {
      return res.status(400).json({
        error: "No hay productos cargados.",
      });
    } else {
      return res.json(arrayProductos);
    }
  });
});

router.get("/productos/listar/:id", (req, res) => {
  const idBuscado = parseInt(req.params.id);
  const data = fs.readFile("./productos.json", "utf-8", function (err, data) {
    if (err) {
      if (err.errno == -2) {
        return res.status(400).json({
          error: "No existe archivo/db",
        });
      } else {
        res.send(err);
      }
    }
    let arrayProductos = JSON.parse(data);

    if (arrayProductos.length == 0) {
      return res.status(400).json({
        error: "No hay productos cargados.",
      });
    } else {
      let productoEncontrado = arrayProductos.filter(
        (aProduct) => aProduct.id == idBuscado
      );
      if (productoEncontrado.length == 0) {
        return res.json({
          msj: `No existe producto con id ${idBuscado}`,
        });
      }
      return res.json(productoEncontrado);
    }
  });
});

router.post("/productos/guardar", (req, res) => {
  const body = req.body;
  //Valida los datos ingresados
  if (
    !body.title ||
    !body.price ||
    !body.thumbnail ||
    typeof body.title != "string" ||
    typeof body.price != "number" ||
    typeof body.thumbnail != "string"
  ) {
    return res.status(400).json({
      msj: "Se deben ingresar Titulo(string), Precio(number) y Thumbnail(string) del producto.",
    });
  }

  //Si los datos ingresados son correctos...
  else {
    const data = fs.readFile(
      "./productos.json",
      "utf-8",
      async function (err, data) {
        if (err) {
          if (err.errno == -2) {
            //Si el archivo no existe, se crea con el nuevo producto
            let arrayProductos = JSON.parse("[\n]");

            const nuevoProducto = {
              id: 1,
              title: body.title,
              price: body.price,
              thumbnail: body.thumbnail,
            };

            arrayProductos.push(nuevoProducto);

            //Guarda el archivo nuevo con el producto
            fs.writeFile(
              "./productos.json",
              JSON.stringify(arrayProductos, null, "\t"),
              (err) => {
                if (err) {
                  return res.status(400).json({
                    msj: err,
                  });
                }
                return res.json({
                  nuevo_producto_guardado: nuevoProducto,
                  msj: "Producto guardado correctamente",
                });
              }
            );
          }
        }
        //Si el archivo existe...
        else {
          let arrayProductos = JSON.parse(data);
          const nuevoProducto = {
            id: arrayProductos[arrayProductos.length - 1].id + 1,
            title: body.title,
            price: body.price,
            thumbnail: body.thumbnail,
          };
          arrayProductos.push(nuevoProducto);
          //Guarda el archivo nuevo con el producto
          fs.writeFile(
            "./productos.json",
            JSON.stringify(arrayProductos, null, "\t"),
            (err) => {
              if (err) {
                return res.status(400).json({
                  msj: err,
                });
              }
              return res.json({
                nuevoProducto,
                msj: "Producto guardado correctamente.",
              });
            }
          );
        }
      }
    );
  }
});

router.delete("/productos/eliminar/:id", (req, res) => {
  const idBuscado = Number(req.params.id);

  //Carga productos.json
  const data = fs.readFile(
    "./productos.json",
    "utf-8",
    async function (err, data) {
      let arrayProductos = JSON.parse(data);

      const productoEliminado = arrayProductos.filter(
        (aProduct) => aProduct.id == idBuscado
      );

      //Si el producto a eliminar existe
      if (productoEliminado.length > 0) {
        arrayProductos = arrayProductos.filter(
          (aProduct) => aProduct.id !== idBuscado
        );

        //Guarda producto en productos.json
        fs.writeFile(
          "./productos.json",
          JSON.stringify(arrayProductos, null, "\t"),
          (err) => {
            if (err) {
              return res.status(400).json({
                error: err,
              });
            }
            return res.json({ "Producto eliminado": productoEliminado });
          }
        );
      } else {
        return res.status(404).json({
          error: `El producto con Id ${idBuscado} no existe.`,
        });
      }
    }
  );
});

router.put("/productos/actualizar/:id", (req, res) => {
  console.log("puttt");
  const idBuscado = Number(req.params.id);
  const body = req.body;
  console.log(body);
  const data = fs.readFile(
    "./productos.json",
    "utf-8",
    async function (err, data) {
      //Valida los datos ingresados
      console.log("validando datos");
      if (
        !body.title ||
        !body.price ||
        !body.thumbnail ||
        typeof body.title != "string" ||
        typeof body.price != "number" ||
        typeof body.thumbnail != "string"
      ) {
        return res.status(400).json({
          error:
            "Se deben ingresar Titulo(string), Precio(number) y Thumbnail(string) del producto.",
        });
      }
      //Si los datos son correctos...
      else {
        const data = fs.readFile(
          "./productos.json",
          "utf-8",
          async function (err, data) {
            //Si el archivo no existe o no puede ser cargado...
            if (err) {
              if (err.errno == -2) {
                return res.status(400).json({
                  error:
                    "No existe archivo/db, cargar un producto para crear el archivo inicial de productos.",
                });
              } else {
                return res.status(400).json({
                  error: err,
                });
              }
            }
            //Si el archivo existe...
            else {
              let arrayProductos = JSON.parse(data);
              const posicion = arrayProductos
                .map((aProduct) => aProduct.id)
                .indexOf(idBuscado);
              if (posicion == -1) {
                return res.status(404).json({
                  msg: `El producto con Id ${idBuscado} no existe.`,
                });
              } else {
                arrayProductos[posicion].title = body.title;
                arrayProductos[posicion].price = body.price;
                arrayProductos[posicion].thumbnail = body.thumbnail;
              }

              //Guarda el producto actualizado
              fs.writeFile(
                "./productos.json",
                JSON.stringify(arrayProductos),
                (err) => {
                  if (err) {
                    return res.status(400).json({
                      error: err,
                    });
                  }
                  return res.json({
                    producto_actualizado: arrayProductos[posicion],
                  });
                }
              );
            }
          }
        );
      }
    }
  );
});

export default router;
