import connection from "../dbStrategy/postgres.js";

export async function getGames(req, res) {
  const search = req.query.name;
  if (!search) {
    try {
      const { rows: games } = await connection.query(
        `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id`
      );
      res.send(games);
    } catch (error) {
      res.status(500).send();
    }
  } else {
    const stringSearch = `${search}%`;
    const { rows: games } = await connection.query(
      `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.name ILIKE $1`,
      [stringSearch]
    );
    res.send(games);
  }
}

export async function addGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
  const queryText = `INSERT INTO games(name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1, $2, $3, $4, $5)`;
  try {
    await connection.query(queryText, [
      name,
      image,
      stockTotal,
      categoryId,
      pricePerDay,
    ]);
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
}
