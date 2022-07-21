import connection from "../dbStrategy/postgres.js";

export async function getCategories(req, res) {
  try {
    const { rows: categories } = await connection.query(
      "SELECT * FROM categories"
    );
    res.send(categories);
  } catch (error) {
    res.status(500).send();
  }
}

export async function addCategorie(req, res) {
  const categorie = req.body;
  try {
    await connection.query("INSERT INTO categories (name) VALUES ($1)", [
      categorie.name,
    ]);
    res.status(201).send();
  } catch (error) {
    res.status(500).send();
  }
}
