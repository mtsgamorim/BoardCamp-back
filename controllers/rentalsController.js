import connection from "../dbStrategy/postgres.js";
import dayjs from "dayjs";

export async function addRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  const today = dayjs().format("YYYY/MM/DD");
  try {
    const { rows: game } = await connection.query(
      `SELECT * FROM games WHERE id = $1`,
      [gameId]
    );
    const price = game[0].pricePerDay * daysRented;
    await connection.query(
      `INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [customerId, gameId, today, daysRented, null, price, null]
    );
    res.status(201).send();
  } catch (error) {
    res.status(500).send();
  }
}

export async function updateRental(req, res) {
  const id = parseInt(req.params.id);
  const today = dayjs().format("YYYY/MM/DD");
  let delayFee = 0;
  try {
    const { rows: rental } = await connection.query(
      `SELECT * FROM rentals WHERE id = $1`,
      [id]
    );
    const diffInDay = dayjs(today).diff(rental[0].rentDate, "day");
    const delay = diffInDay - rental[0].daysRented;
    console.log(delay);
    if (delay > 0) {
      console.log("entrei aqui");
      const price = rental[0].originalPrice / rental[0].daysRented;
      delayFee = delay * price;
    }
    await connection.query(
      `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
      [today, delayFee, id]
    );
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
}

export async function getRental(req, res) {
  const queryCustomerId = parseInt(req.query.customerId);
  const queryGameId = parseInt(req.query.gameId);
  const response = [];
  try {
    if (
      (!queryCustomerId && !queryGameId) ||
      (queryCustomerId && queryGameId)
    ) {
      const { rows: rental } = await connection.query(
        `SELECT rentals.*, customers.id AS "customerID", customers.name AS "customerName", games.id AS "gameN", games.name AS "gameName", games."categoryId", categories.name AS "categoryName"  FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id`
      );
      for (let i = 0; i < rental.length; i++) {
        response.push({
          id: rental[i].id,
          customerId: rental[i].customerId,
          gameId: rental[i].gameId,
          rentDate: rental[i].rentDate,
          daysRented: rental[i].daysRented,
          returnDate: rental[i].returnDate,
          originalPrice: rental[i].originalPrice,
          delayFee: rental[i].delayFee,
          customer: {
            id: rental[i].customerID,
            name: rental[i].customerName,
          },
          game: {
            id: rental[i].gameN,
            name: rental[i].gameName,
            categoryId: rental[i].categoryId,
            categoryName: rental[i].categoryName,
          },
        });
      }
    } else if (queryCustomerId) {
      const { rows: rental } = await connection.query(
        `SELECT rentals.*, customers.id AS "customerID", customers.name AS "customerName", games.id AS "gameN", games.name AS "gameName", games."categoryId", categories.name AS "categoryName"  FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE customers.id = $1`,
        [queryCustomerId]
      );
      for (let i = 0; i < rental.length; i++) {
        response.push({
          id: rental[i].id,
          customerId: rental[i].customerId,
          gameId: rental[i].gameId,
          rentDate: rental[i].rentDate,
          daysRented: rental[i].daysRented,
          returnDate: rental[i].returnDate,
          originalPrice: rental[i].originalPrice,
          delayFee: rental[i].originalPrice,
          customer: {
            id: rental[i].customerID,
            name: rental[i].customerName,
          },
          game: {
            id: rental[i].gameN,
            name: rental[i].gameName,
            categoryId: rental[i].categoryId,
            categoryName: rental[i].categoryName,
          },
        });
      }
    } else {
      const { rows: rental } = await connection.query(
        `SELECT rentals.*, customers.id AS "customerID", customers.name AS "customerName", games.id AS "gameN", games.name AS "gameName", games."categoryId", categories.name AS "categoryName"  FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE games.id = $1`,
        [queryGameId]
      );
      for (let i = 0; i < rental.length; i++) {
        response.push({
          id: rental[i].id,
          customerId: rental[i].customerId,
          gameId: rental[i].gameId,
          rentDate: rental[i].rentDate,
          daysRented: rental[i].daysRented,
          returnDate: rental[i].returnDate,
          originalPrice: rental[i].originalPrice,
          delayFee: rental[i].originalPrice,
          customer: {
            id: rental[i].customerID,
            name: rental[i].customerName,
          },
          game: {
            id: rental[i].gameN,
            name: rental[i].gameName,
            categoryId: rental[i].categoryId,
            categoryName: rental[i].categoryName,
          },
        });
      }
    }
    res.send(response);
  } catch (error) {
    res.status(500).send();
  }
}
