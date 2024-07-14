import { Router } from "express";
import usersRouter from "../routes/user";
import productsRouter from "../routes/products";
import authRouter from "../routes/auth";
import cartRouter from "../routes/cart";

//you can initialize all your routes here
//to avoid writing alot of code in the index file
//or you can register middleware as well
const router = Router();

router.use(usersRouter);
router.use(productsRouter);
router.use(authRouter);
router.use(cartRouter);
//prefix all the router here with /api
router.use("/api", router);

export default router;
