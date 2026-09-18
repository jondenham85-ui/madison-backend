import { pool } from "../../madison-backend/db.js";

export async function getProducts() {
  const result = await pool.query("SELECT * FROM shopmad_products ORDER BY id ASC");
  return result.rows;
}

export async function addProduct({ name, description, price, image }) {
  const result = await pool.query(
    `INSERT INTO shopmad_products (name, description, price, image)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description, price, image]
  );
  return result.rows[0];
}
