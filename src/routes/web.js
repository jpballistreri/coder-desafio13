import express from "express";
import fs from "fs";
import { DBService } from "../services/db";

const router = express.Router();

router.get("/vista", async (req, res) => {
  const arrayProductos = await DBService.get("productos");

  res.render("main", arrayProductos);
});

router.get("/ingreso", (req, res) => {
  res.render("ingreso");
});

export default router;
