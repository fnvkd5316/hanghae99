const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    value: String,
    doneAt: Date, //체크를 햇는지 안햇는지
    order: Number,
});


TodoSchema.virtual("todoId").get(function() {
    return this._id.toHexString();
});

TodoSchema.set("toJSON", {
    virtuals: true,
});


module.exports = mongoose.model("Todo", TodoSchema);