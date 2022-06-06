const express = require("express");
const User = require("../models/user.js");
const Goods = require("../models/goods.js");
const Cart = require("../models/cart.js");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware.js");


router.get("/", authMiddleware, async (req, res) => {
    const { category } = req.query;

    const goods = await Goods.find({ category }); //find

    res.json({
        goods, // js 객체 초기자
    });
});

router.get("/cart", authMiddleware, async (req, res) => {
    const { userId } = res.locals;

    const carts = await Cart.find(userId).exec();
    const goodsIds = carts.map((cart) => cart.goodsId);
    const goods = await Goods.find({ goodsId: goodsIds });

    res.json({
        cart: carts.map((cart) => ({
            quantity: cart.quantity,
            goods: goods.find((item) => item.goodsId === cart.goodsId),
        })),
    });
});


router.get("/:goodsId", authMiddleware, async (req, res) => {
    const { goodsId } = req.params;
    const [goods] = await Goods.find({ goodsId }); //find()는 promise를 반환한다.

    res.json({
        goods,
    });
});

router.post("/:goodsId/cart", authMiddleware, async (req, res) => {
    const { goodsId } = req.params;
    const { quantity } = req.body;

    const existsCarts = await Cart.find({ goodsId });
    if (existsCarts.length) {
        return res.status(400).json({ success: false, errorMessage: "이미 장바구니에 들어있는 상품입니다." });
    }

    res.json({ success: true });
});


router.delete("/:goodsId/cart", authMiddleware, async (req, res) => {
    const { userId } = res.locals;
    const { goodsId } = req.params;

    const existsCarts = await Cart.find({ userId, goodsId });

    if (existsCarts.length) {
        await Cart.deleteOne({ goodsId });
    }

    res.json({ success: true });
});

router.put("/:goodsId/cart", authMiddleware, async (req, res) => {
    const { userId } = res.locals; 
    const { goodsId } = req.params;
    const { quantity } = req.body;

    const existsCarts = await Cart.find({ userId, goodsId });

    if (!existsCarts.length) {
        await Cart.create({ userId, goodsId, quantity });
    } else {
        await Cart.updateOne({ userId, goodsId }, { $set: { quantity } });
    }

    res.json({ success: true });
});


router.post("/", authMiddleware, async (req, res) => {

    const { goodsId, name, thumbnailUrl, category, price } = req.body; //디스트럭쳐링 / 비할당구조화

    const goods = await Goods.find({ goodsId }); // find라는 함수는 promise를 반환한다.

    if (goods.length) {
        return res
            .status(400)
            .json({ success: false, errorMessage: "이미 있는 데이터입니다." });
    }
});


module.exports = router;