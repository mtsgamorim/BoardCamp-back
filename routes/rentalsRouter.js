import { Router } from "express";
import {
  addRental,
  deleteRental,
  getRental,
  updateRental,
} from "../controllers/rentalsController.js";
import {
  validateDelete,
  validateRentals,
  validateReturn,
} from "../middlewares/rentalsMiddlewares.js";

const router = Router();

router.get("/rentals", getRental);
router.post("/rentals", validateRentals, addRental);
router.post("/rentals/:id/return", validateReturn, updateRental);
router.delete("/rentals/:id", validateDelete, deleteRental);

export default router;
