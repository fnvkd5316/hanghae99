const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Todo = require("./models/todo.js");


mongoose.connect("mongodb://localhost/todo-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hi!");
});

router.post("/todos", async (req, res) => {
    const { value } = req.body;

    const maxOrderTodo = await Todo.findOne().sort("-order").exec();

    let order = 1;

    if (maxOrderTodo) {
        order = maxOrderTodo.order + 1;
    };

    const todo = new Todo({ value, order });

    await todo.save();

    res.send({ todo });
});

router.get("/todos", async (req, res) => {

    const todos = await Todo.find().sort("-order").exec();

    res.send({ todos });
});

router.patch("/todos/:todoId", async (req, res) => {

    const { todoId } = req.params;
    const { order, value, done } = req.body;

    const todo = await Todo.findById(todoId).exec();

    if (!todo){
      return res.send({});
    }

    if (order) {
        const targetTodo = await Todo.findOne({ order }).exec();
        if (targetTodo) {
            targetTodo.order = todo.order;
            await targetTodo.save();
        }
        todo.order = order;
    }else if (value) {
        todo.value = value;
    }else if (done) {
        todo.doneAt = new Date();
    }else {
        todo.doneAt = null;
    }

    await todo.save();

    res.send({ });
});

router.delete("/todos/:todoId", async (req, res) => {
    const { todoId } = req.params;

    await Todo.deleteOne({ _id: todoId }).exec();

    res.send({});
});

app.use("/api", bodyParser.json(), router);
app.use(express.static("./assets"));

app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});