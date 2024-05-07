import { Router } from "express";

import {
  openWebCarrefour,
  getProductsByNameCarrefour,
} from "../core/carrefour.js";

const router = Router();

router.get("/", async (req, res) => {
  const results = await openWebCarrefour();
  res.send(results);
});
//mas rutas

export default router;
