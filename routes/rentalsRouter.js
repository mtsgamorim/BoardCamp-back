import { Router } from "express";
import {
  addRental,
  getRental,
  updateRental,
} from "../controllers/rentalsController.js";
import {
  validateRentals,
  validateReturn,
} from "../middlewares/rentalsMiddlewares.js";

const router = Router();

router.get("/rentals", getRental);
router.post("/rentals", validateRentals, addRental);
router.post("/rentals/:id/return", validateReturn, updateRental);

export default router;
