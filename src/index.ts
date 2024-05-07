import express from "express";
import fetchRoutes from "./routes/routes.js";
// import { port } from "./configs.js";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use(fetchRoutes);
app.listen(PORT);
console.log(PORT);
