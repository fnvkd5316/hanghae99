const mongoose = require("mongoose");

const goodsSchema = mongoose.Schema({
    name: {
        type: String,
    },
    thumbnailUrl: {
        type: String,
    },
    category: {
        type: String,
    },
    price: {
        type: Number,
    },
});

goodsSchema.virtual("goodsId").get(function () {
    return this._id.toHexString();
  });
  goodsSchema.set("toJSON", {
    virtuals: true,
  });

module.exports = mongoose.model("Goods", goodsSchema);