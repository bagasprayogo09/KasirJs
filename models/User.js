const db = require("../config/db");

const User = {
    getAll: (callback) => {
        db.query("SELECT id, name, email, role FROM users", callback);
    },

    create: (data, callback) => {
        const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        db.query(sql, [data.name, data.email, data.password, data.role], callback);
    },

    findByEmail: (email, callback) => {
        db.query("SELECT * FROM users WHERE email = ?", [email], callback);
    } 
};

module.exports = User;
