import { Router } from "express";
import { addGame, getGames } from "../controllers/gamesControllers.js";
import validateGame from "../middlewares/gamesMiddlewares.js";

const router = Router();

router.get("/games", getGames);
router.post("/games", validateGame, addGame);

export default router;
