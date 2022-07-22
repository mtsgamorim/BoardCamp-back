import joi from "joi";
import connection from "../dbStrategy/postgres.js";

async function validateGame(req, res, next) {
  const game = req.body;
  const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().greater(0).required(),
    categoryId: joi.number().required(),
    pricePerDay: joi.number().greater(0).required(),
  });

  const validation = gameSchema.validate(game);
  if (validation.error) {
    res.status(400).send();
    return;
  }
  try {
    const { rows: validCategoryId } = await connection.query(
      "SELECT * FROM categories WHERE id = $1",
      [game.categoryId]
    );
    if (validCategoryId.length === 0) {
      res.status(400).send();
      return;
    }
    const { rows: gameInDb } = await connection.query(
      "SELECT * FROM games WHERE name = $1",
      [game.name]
    );
    if (gameInDb.length > 0) {
      res.status(409).send();
      return;
    }
  } catch (error) {
    res.status(500).send();
    return;
  }
  next();
}

export default validateGame;
