import { Router } from "express";

import {
  getAlmacenCarrefour,
  getProductosPorNombreCarrefour,
} from "../core/carrefour.js";
import {
  getAlmacenChangoMas,
  getProductosPorNombreChangoMas,
} from "../core/changoMas.js";
import { getAlmacenVea, getProductosPorNombreVea } from "../core/vea.js";
import { getAlmacenAtomo, getProductosPorNombreAtomo } from "../core/atomo.js";

const router = Router();

//Carrefour
router.get("/carrefour", async (req, res) => {
  const results = await getAlmacenCarrefour();
  res.send(results);
});
router.get("/carrefour/searchByName", async (req, res) => {
  const name = req.query.name;
  console.log(name);
  const results = await getProductosPorNombreCarrefour("kitkat");
  res.send(results);
});

router.get("/changoMas", async (req, res) => {
  const results = await getAlmacenChangoMas();
  res.send(results);
});

router.get("/changoMas/searchByName", async (req, res) => {
  const name = req.query.name;
  console.log(name);
  const results = await getProductosPorNombreChangoMas("kitkat");
  res.send(results);
});

router.get("/vea", async (req, res) => {
  const name = req.query.name;
  console.log(name);
  //Eliminar el /almacen/ de la url
  //No trae el precio
  const results = await getAlmacenVea();
  res.send(results);
});
router.get("/vea/searchByName", async (req, res) => {
  const name = req.query.name;
  console.log(name);
  //No trae el precio
  const results = await getProductosPorNombreVea("kitkat");
  res.send(results);
});

router.get("/atomo", async (req, res) => {
  //Algunas imagenes vuelven en null
  const results = await getAlmacenAtomo();
  res.send(results);
});

router.get("/atomo/searchByName", async (req, res) => {
  const name = req.query.name;
  console.log(name);
  //Me devuelve solo img y precio
  const results = await getProductosPorNombreAtomo("kitkat");
  res.send(results);
});

export default router;
