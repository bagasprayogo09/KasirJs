const db = require("../config/db");
const { create } = require("./Product");

const TransactionItem = {
  create: (items, callback) => {
    const query = `
      INSERT INTO transaction_items (transaction_id, product_id, quantity, subtotal)
      VALUES ?
    `;
    const values = items.map(item => [
      item.transaction_id,
      item.product_id,
      item.quantity,
      item.subtotal
    ]);

    db.query(query, [values], callback);
  }
};


module.exports = TransactionItem;