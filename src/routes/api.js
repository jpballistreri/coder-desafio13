import express from "express";
import fs from "fs";
import { DBService } from "../services/db";

const router = express.Router();

router.get("/productos/listar", async (req, res) => {
  const items = await DBService.get("productos");
  res.json({
    data: items,
  });
});
router.get("/productos/listar/:id", async (req, res) => {
  const { id } = req.params;
  const item = await DBService.get("productos", id);
  if (!item.length)
    return res.status(404).json({
      msgs: "Producto no encontrado!",
    });

  res.json({
    data: item,
  });
});

router.post("/productos/guardar", async (req, res) => {
  const { title, price, thumbnail } = req.body;
  //Validar datos ingresados

  if (
    !title ||
    !price ||
    !thumbnail ||
    typeof title != "string" ||
    typeof price != "number" ||
    typeof thumbnail != "string"
  ) {
    return res.status(400).json({
      msj: "Se deben ingresar Titulo(string), Precio(number) y Thumbnail(string) del producto.",
    });
  }
  const item = {
    title,
    price,
    thumbnail,
  };
  const newId = await DBService.create("productos", item);
  const newProduct = await DBService.get("productos", newId);
  res.json({
    msj: "Producto agregado.",
    data: newProduct,
  });
});

router.delete("/productos/eliminar/:id", async (req, res) => {
  const { id } = req.params;
  const productoAEliminar = await DBService.get("productos", id);
  if (!productoAEliminar.length) {
    return res.status(400).json({
      msj: "No existe el producto.",
    });
  }

  await DBService.delete("productos", id);

  res.json({
    Producto_eliminado: productoAEliminar,
  });
});

router.put("/productos/actualizar/:id", async (req, res) => {
  const { id } = req.params;
  const { title, price, thumbnail } = req.body;
  if (
    !title ||
    !price ||
    !thumbnail ||
    typeof title != "string" ||
    typeof price != "number" ||
    typeof thumbnail != "string"
  ) {
    return res.status(400).json({
      msj: "Se deben ingresar Titulo(string), Precio(number) y Thumbnail(string) del producto.",
    });
  }

  const productoAActualizar = await DBService.get("productos", id);
  if (!productoAActualizar.length) {
    return res.status(400).json({
      msj: "No existe el producto.",
    });
  }

  const item = {
    title,
    price,
    thumbnail,
  };
  await DBService.update("productos", id, item);
  const productoActualizado = await DBService.get("productos", id);
  //console.log(await productoActualizado);
  res.json({
    Producto_actualizado: productoActualizado,
  });
});

export default router;
