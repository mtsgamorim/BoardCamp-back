import { Router } from "express";
import {
  addCustomers,
  getCustomers,
  getCustomersByID,
  updateCustomer,
} from "../controllers/customersController.js";
import {
  validateCustomers,
  validateCustomers2,
} from "../middlewares/customersMiddlewares.js";

const router = Router();

router.get("/customers", getCustomers);

router.get("/customers/:id", getCustomersByID);

router.post("/customers", validateCustomers, addCustomers);

router.put("/customers/:id", validateCustomers2, updateCustomer);

export default router;
