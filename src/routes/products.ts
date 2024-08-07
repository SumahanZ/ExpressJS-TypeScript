import { Router, Request, Response } from "express";

const router = Router();

router.get("/products", (req: Request, res: Response) => {
  //retrieve the cookies but this is still in unparsed form, we can use a library to parse the cookies for us
  //console.log(req.headers.cookie);
  console.log(req.cookies);
  //get signed cookies
  console.log(req.signedCookies);

  //do condition to check if the everything in the cookie is already correct
  // if (req.cookies.hello && req.cookies.hello === "world") {
  //   return res.send([{ id: 123, name: "chicken breast", price: 12.99 }]);
  // }

  //keep track of the unsigned cookies and signed cookies, cause they are different
  if (req.signedCookies.hello && req.signedCookies.hello === "world") {
    return res.send([{ id: 123, name: "chicken breast", price: 12.99 }]);
  }

  return res.status(401).send([{ msg: "Sorry. You need the correct cookie" }]);
});

export default router;
