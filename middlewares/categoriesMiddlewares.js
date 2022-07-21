import joi from "joi";
import connection from "../dbStrategy/postgres.js";

async function validateCategorie(req, res, next) {
  const categorie = req.body;
  const categorieSchema = joi.object({
    name: joi.string().required(),
  });

  const validation = categorieSchema.validate(categorie);
  if (validation.error) {
    res.status(400).send();
    return;
  }

  try {
    const { rows: categorieInDb } = await connection.query(
      "SELECT * FROM categories WHERE name = $1",
      [categorie.name]
    );
    if (categorieInDb.length > 0) {
      res.status(409).send();
      return;
    }
  } catch (error) {
    res.status(500).send();
    return;
  }
  next();
}

export default validateCategorie;
