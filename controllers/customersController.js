import connection from "../dbStrategy/postgres.js";

export async function addCustomers(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  try {
    await connection.query(
      "INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1, $2, $3, $4)",
      [name, phone, cpf, birthday]
    );
    res.status(201).send();
  } catch (error) {
    res.status(500).send();
  }
}

export async function getCustomers(req, res) {
  const searchCPF = req.query.cpf;
  if (!searchCPF) {
    try {
      const { rows: customers } = await connection.query(
        `SELECT * FROM customers`
      );
      res.send(customers);
    } catch (error) {
      res.status(500).send();
    }
  } else {
    const stringSearch = `${searchCPF}%`;
    const { rows: SearchCustomers } = await connection.query(
      `SELECT * FROM customers WHERE cpf ILIKE $1`,
      [stringSearch]
    );
    res.send(SearchCustomers);
  }
}

export async function getCustomersByID(req, res) {
  const id = parseInt(req.params.id);
  try {
    const { rows: customer } = await connection.query(
      `SELECT * FROM customers WHERE id = $1`,
      [id]
    );
    if (customer.length === 0) {
      res.status(404).send();
      return;
    }
    res.send(customer[0]);
  } catch (error) {
    res.status(500).send();
  }
}

export async function updateCustomer(req, res) {
  const id = parseInt(req.params.id);
  const { name, phone, cpf, birthday } = req.body;
  try {
    const { rows: customer } = await connection.query(
      `SELECT * FROM customers WHERE id = $1`,
      [id]
    );
    if (customer.length === 0) {
      res.status(404).send();
      return;
    }
    await connection.query(
      `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`,
      [name, phone, cpf, birthday, id]
    );
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
}
