import { loggingMiddlware } from "./middlewares";
import { Router } from "express";

const router = Router();

router.use(loggingMiddlware);
export default router;
