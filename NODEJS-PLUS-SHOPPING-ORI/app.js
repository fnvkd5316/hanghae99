const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/user.js");
const goodsRouter = require("./routes/goods");
const Joi = require('joi');

const authMiddleware = require("./middlewares/auth-middleware.js");

mongoose.connect("mongodb://localhost/spa_mall", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

app.use("/api", express.urlencoded({ extended: false }), router);
app.use("/api/goods", express.urlencoded({ extended: false }), goodsRouter);
app.use(express.static("assets"));

const postUsersSchema = Joi.object({
    nickname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(6).required(),
    confirmPassword: Joi.string().alphanum().min(6).required(),
});

router.post("/users", async (req, res) => {
    try {
        var {
            nickname,
            email,
            password,
            confirmPassword
        } = await postUsersSchema.validateAsync(req.body);
    }catch(err) {
        return res.status(400).send({
            errorMessage: '입력조건이 맞지 않습니다.'
        })
    };

    if (password !== confirmPassword) {
        return res.status(400).send({
            errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.'
        });
    }

    const existUsers = await User.find({
        $or: [{ email }, { nickname }], //닉네임이나 이메일이 겹치는거 다 가져와.
    });

    if (existUsers.length) {
        return res.status(400).send({
            errorMessage: '이미 가입된 이메일 또는 닉네임이 있습니다.',
        });
    }

    const user = new User({ email, nickname, password });
    await user.save();

    res.status(201).send({});
});


const postAuthSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(6).required(),
});

router.post("/auth", async (req, res) => {
    try {
        var { email, password } = await postAuthSchema.validateAsync(req.body);
    }catch{
        return res.status(400).send({
            errorMessage: "이메일 또는 패스워드가 잘못됐습니다.",
        });
    }
    const user = await User.findOne({ email, password }).exec();

    //인증 메시지는 친절하지 않아도된다.
    if (!user || password !== user.password) {
        return res.status(400).send({
            errorMessage: "이메일 또는 패스워드가 잘못됐습니다.",
        });
    }

    const token = jwt.sign({ userId: user.userId }, "customized-secret-key");

    res.send({
        token,
    });
});

router.get("/users/me", authMiddleware, async (req, res) => {

    const { user } = res.locals;

    if (!user) {
        return res.status(400).send({});
    }

    res.status(201).send({
        user: {
            email: user.email,
            nickname: user.nickname,
        },
    });
});


app.listen(8080, () => {
    console.log("서버가 요청을 받을 준비가 됐어요");
});