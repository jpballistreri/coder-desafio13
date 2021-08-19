import express from "express";
import fs from "fs";

const router = express.Router();

router.get("/vista", (req, res) => {
  const arrayProductos = fs.readFile(
    "./productos.json",
    "utf-8",
    function (err, data) {
      if (err) {
        return res.render("main", { productos: [] });
      }

      let arrayProductos = JSON.parse(data);
      let test = { productos: arrayProductos };
      res.render("main", test);
    }
  );
});

router.get("/ingreso", (req, res) => {
  res.render("ingreso");
});

export default router;
