import { Router, Request, Response } from "express";

const router = Router();

router.post("/cart", (req: Request, res: Response) => {
  if (!req.session.user) return res.sendStatus(401);

  const { body: item } = req;

  const { cart } = req.session;

  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }

  return res.status(201).send(item);
});

router.get("/cart", (req: Request, res: Response) => {
  //check if sessionID and userobject is stored within the cookie/SessionStore
  if (!req.session.user) return res.sendStatus(401);
  //if req.sesion.cart doesnt't exist just return a blank cart (empty array)
  return res.send(req.session.cart ?? []);
});

export default router;
