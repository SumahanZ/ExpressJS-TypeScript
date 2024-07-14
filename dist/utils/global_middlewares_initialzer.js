"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("./middlewares");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.use(middlewares_1.loggingMiddlware);
exports.default = router;
