const Product = require("../models/Product");
const User = require("../models/User");


exports.getDashboard = (req,res) => {
    Product.getALL((err, products)=> {
        if (err) return res.status(500).json({message: "Gagal ambil produk"});

        User.getAll((err2, users) => {
            if (err2) return res.status(500).json({message: "Gagal ambil user"});

            res.json({
                message: "Selamat Datang di Dashboard admin",
                total_produk: products.length,
                total_user: users.length,
            });
        });
    });
};