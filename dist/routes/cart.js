"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/cart", (req, res) => {
    if (!req.session.user)
        return res.sendStatus(401);
    const { body: item } = req;
    const { cart } = req.session;
    if (cart) {
        cart.push(item);
    }
    else {
        req.session.cart = [item];
    }
    return res.status(201).send(item);
});
router.get("/cart", (req, res) => {
    var _a;
    //check if sessionID and userobject is stored within the cookie/SessionStore
    if (!req.session.user)
        return res.sendStatus(401);
    //if req.sesion.cart doesnt't exist just return a blank cart (empty array)
    return res.send((_a = req.session.cart) !== null && _a !== void 0 ? _a : []);
});
exports.default = router;
