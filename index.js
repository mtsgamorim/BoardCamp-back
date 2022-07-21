import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

import categoriesRouter from "./routes/categoriesRouter.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(json());

app.use(categoriesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando na porta ${PORT}`);
});
