import session from "express-session";
import { CartItem, User } from "../../utils/interfaces";

declare module "express-session" {
  export interface SessionData {
    visited: { [key: boolean]: any };
    user: { [key: User]: any };
    cart: CartItem[];
  }
}
