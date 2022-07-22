import joi from "joi";
import connection from "../dbStrategy/postgres.js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

export async function validateCustomers(req, res, next) {
  const customer = req.body;
  const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi
      .string()
      .pattern(/^[0-9]{10,11}$/)
      .required(),
    cpf: joi
      .string()
      .pattern(/^[0-9]{11}$/)
      .required(),
    birthday: joi.string().required(),
  });

  const validation = customerSchema.validate(customer);
  if (validation.error) {
    res.status(400).send();
    return;
  }

  const dateIsValid = dayjs(customer.birthday, "YYYY-MM-DD", true).isValid();
  if (!dateIsValid) {
    res.status(400).send();
    return;
  }

  try {
    const { rows: cpfExistInDB } = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1",
      [customer.cpf]
    );
    if (cpfExistInDB.length > 0) {
      res.status(409).send();
      return;
    }
  } catch (error) {
    res.status(500).send();
    return;
  }
  next();
}

export async function validateCustomers2(req, res, next) {
  const customer = req.body;
  const id = parseInt(req.params.id);
  const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi
      .string()
      .pattern(/^[0-9]{10,11}$/)
      .required(),
    cpf: joi
      .string()
      .pattern(/^[0-9]{11}$/)
      .required(),
    birthday: joi.string().required(),
  });

  const validation = customerSchema.validate(customer);
  if (validation.error) {
    res.status(400).send();
    return;
  }

  const dateIsValid = dayjs(customer.birthday, "YYYY-MM-DD", true).isValid();
  if (!dateIsValid) {
    res.status(400).send();
    return;
  }

  try {
    const { rows: cpfExistInDB } = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1",
      [customer.cpf]
    );
    if (cpfExistInDB.length > 0 && cpfExistInDB[0].id != id) {
      res.status(409).send();
      return;
    }
  } catch (error) {
    res.status(500).send();
    return;
  }
  next();
}
