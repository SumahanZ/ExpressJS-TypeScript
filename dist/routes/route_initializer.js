"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../routes/user"));
const products_1 = __importDefault(require("../routes/products"));
const auth_1 = __importDefault(require("../routes/auth"));
const cart_1 = __importDefault(require("../routes/cart"));
//you can initialize all your routes here
//to avoid writing alot of code in the index file
//or you can register middleware as well
const router = (0, express_1.Router)();
router.use(user_1.default);
router.use(products_1.default);
router.use(auth_1.default);
router.use(cart_1.default);
//prefix all the router here with /api
router.use("/api", router);
exports.default = router;
