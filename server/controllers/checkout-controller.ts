import BaseController from "./base-controller";
import auth from "../middlewares/auth";
import { NextAuthApiRequest } from "../types";
import { NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

class CheckoutController extends BaseController {
  constructor() {
    super();
    this.use(auth);
  }

  public async create(req: NextAuthApiRequest, res: NextApiResponse) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 5000,
        currency: "brl",
        payment_method_types: ["card"],
        metadata: { userId: req.userId },
      });

      return res
        .status(200)
        .json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao criar sessao de checkout" });
    }
  }
}

export default CheckoutController;
