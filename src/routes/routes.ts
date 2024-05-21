import { Router } from "express";

import {
  getAlmacenCarrefour,
  getProductosPorNombre,
  // getProductsByNameCarrefour,
} from "../core/carrefour.js";

const router = Router();

//Carrefour
router.get("/carrefour", async (req, res) => {
  const results = await getAlmacenCarrefour();
  res.send(results);
});
router.get("/carrefour/searchByName", async (req, res) => {
  const name = req.query.name;
  console.log(name);
  const results = await getProductosPorNombre("kitkat");
  res.send(results);
});

export default router;
