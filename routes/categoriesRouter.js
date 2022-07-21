import { Router } from "express";
import {
  addCategorie,
  getCategories,
} from "../controllers/categoriesController.js";
import validateCategorie from "../middlewares/categoriesMiddlewares.js";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", validateCategorie, addCategorie);

export default router;
