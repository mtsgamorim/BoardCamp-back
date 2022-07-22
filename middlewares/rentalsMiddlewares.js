import joi from "joi";
import connection from "../dbStrategy/postgres.js";

export async function validateRentals(req, res, next) {
  const rentals = req.body;
  const rentalsSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().greater(0).required(),
  });

  const validation = rentalsSchema.validate(rentals);
  if (validation.error) {
    res.status(400).send();
    return;
  }
  try {
    const { rows: validCustomerId } = await connection.query(
      "SELECT * FROM customers WHERE id = $1",
      [rentals.customerId]
    );
    const { rows: validGameId } = await connection.query(
      "SELECT * FROM games WHERE id = $1",
      [rentals.gameId]
    );

    if (validCustomerId.length === 0 || validGameId.length === 0) {
      res.status(400).send();
      return;
    }

    const { rows: gameInRent } = await connection.query(
      `SELECT * FROM rentals WHERE "gameId" = $1`,
      [rentals.gameId]
    );

    if (gameInRent.length >= validGameId.stockTotal) {
      res.status(400).send();
      return;
    }
  } catch (error) {
    res.status(500).send();
    return;
  }
  next();
}

export async function validateReturn(req, res, next) {
  const id = parseInt(req.params.id);
  try {
    const { rows: rental } = await connection.query(
      `SELECT * FROM rentals WHERE id = $1`,
      [id]
    );
    if (rental.length === 0) {
      res.status(404).send();
      return;
    }
    if (rental[0].returnDate !== null) {
      res.status(400).send();
      return;
    }
  } catch (error) {
    res.status(500).send();
    return;
  }
  next();
}
