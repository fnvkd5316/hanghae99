const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    userId: String,
    goodsId: String,
    quantity: Number,
});

module.exports = mongoose.model("Cart", schema);