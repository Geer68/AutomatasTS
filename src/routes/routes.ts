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
import { getAlmacenCoto, getProductosPorNombreCoto } from "../core/coto.js";

const router = Router();

//Carrefour
router.get("/carrefour", async (req, res) => {
  const results = await getAlmacenCarrefour();
  res.send({ products: results });
});
router.get("/carrefour/searchByName", async (req, res) => {
  const name = req.query.name;
  const startTime = Date.now();
  const results = await getProductosPorNombreCarrefour(name);
  const endTime = Date.now();
  const elapsedTimeInSeconds = (endTime - startTime) / 1000;
  console.log("Tiempo transcurrido:", elapsedTimeInSeconds, "segundos");
  res.send({ products: results });
});

router.get("/changoMas", async (req, res) => {
  const results = await getAlmacenChangoMas();
  res.send({ products: results });
});

router.get("/changoMas/searchByName", async (req, res) => {
  const name = req.query.name;
  const startTime = Date.now();
  const results = await getProductosPorNombreChangoMas(name);
  const endTime = Date.now();
  const elapsedTimeInSeconds = (endTime - startTime) / 1000;
  console.log("Tiempo transcurrido:", elapsedTimeInSeconds, "segundos");
  res.send({ products: results });
});

router.get("/vea", async (req, res) => {
  //Eliminar el /almacen/ de la url
  //No trae el precio
  const results = await getAlmacenVea();
  res.send({ products: results });
});
router.get("/vea/searchByName", async (req, res) => {
  const name = req.query.name;
  const startTime = Date.now();
  //No trae el precio
  const results = await getProductosPorNombreVea(name);
  const endTime = Date.now();
  const elapsedTimeInSeconds = (endTime - startTime) / 1000;
  console.log("Tiempo transcurrido:", elapsedTimeInSeconds, "segundos");
  res.send({ products: results });
});

router.get("/atomo", async (req, res) => {
  //Algunas imagenes vuelven en null
  const results = await getAlmacenAtomo();
  res.send({ products: results });
});

router.get("/atomo/searchByName", async (req, res) => {
  const name = req.query.name;
  const startTime = Date.now();
  //Me devuelve solo img y precio
  const results = await getProductosPorNombreAtomo(name);
  const endTime = Date.now();
  const elapsedTimeInSeconds = (endTime - startTime) / 1000;
  console.log("Tiempo transcurrido:", elapsedTimeInSeconds, "segundos");
  res.send({ products: results });
});

router.get("/coto", async (req, res) => {
  const results = await getAlmacenCoto();
  res.send({ products: results });
});

router.get("/coto/searchByName", async (req, res) => {
  const name = req.query.name;
  const startTime = Date.now();
  const results = await getProductosPorNombreCoto(name);
  const endTime = Date.now();
  const elapsedTimeInSeconds = (endTime - startTime) / 1000;
  console.log("Tiempo transcurrido:", elapsedTimeInSeconds, "segundos");
  res.send({ products: results });
});

export default router;
