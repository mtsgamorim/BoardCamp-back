import { Router } from "express";
import { addRental, getRental } from "../controllers/rentalsController.js";
import validateRentals from "../middlewares/rentalsMiddlewares.js";

const router = Router();

router.get("/rentals", getRental);
router.post("/rentals", validateRentals, addRental);

export default router;
