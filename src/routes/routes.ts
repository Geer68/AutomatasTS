import { Router } from "express";

import {
  getAlmacenCarrefour,
  getBankPromotionsCarrefour,
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
router.get("/carrefour/getBankPromotions", async (req, res) => {
  const startTime = Date.now();
  const results = await getBankPromotionsCarrefour();
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
  const results = await getAlmacenVea();
  res.send({ products: results });
});
router.get("/vea/searchByName", async (req, res) => {
  const name = req.query.name;
  const startTime = Date.now();
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

router.get("/getProductFromAllStores", async (req, res) => {
  const name = req.query.name;
  const startTime = Date.now();
  try {
    const [array1, array2, array3, array4, array5] = await Promise.all([
      getProductosPorNombreCoto(name),
      getProductosPorNombreAtomo(name),
      getProductosPorNombreVea(name),
      getProductosPorNombreChangoMas(name),
      getProductosPorNombreCarrefour(name),
    ]);
    const results = [...array1, ...array2, ...array3, ...array4, ...array5];
    const endTime = Date.now();
    const elapsedTimeInSeconds = (endTime - startTime) / 1000;
    console.log("Tiempo transcurrido:", elapsedTimeInSeconds, "segundos");
    res.send({ products: results });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error al obtener los productos" });
  }
});

export default router;
