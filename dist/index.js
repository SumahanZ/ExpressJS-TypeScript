"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const createApp_1 = require("./createApp");
mongoose_1.default
    .connect("mongodb://127.0.0.1:27017/express_tutorial")
    .then((value) => console.log("Connected to Database"))
    .catch((err) => console.log(`Error: ${err}`));
const app = (0, createApp_1.createApp)();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3002;
app.listen(PORT, () => {
    //Do something when startup
    console.log(`Server is running on http://localhost:${PORT}`);
});
