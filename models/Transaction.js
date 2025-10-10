const db = require("../config/db");

const Transaction = {
  create: (data, callback) => {
    db.query(
      "INSERT INTO transactions (kasir_id, total_amount) VALUES (?, ?)",
      [data.kasir_id, data.total_amount],
      callback
    );
  },

  getAll: (callback) => {
    const sql = `
      SELECT t.id, u.name AS kasir, t.total_amount, t.created_at
      FROM transactions t
      JOIN users u ON t.kasir_id = u.id
    `;
    db.query(sql, callback);
  },
};

module.exports = Transaction;
