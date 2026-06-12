import CheckoutController from "../controllers/checkout-controller";

const controller = new CheckoutController();

const checkoutHandlers = {
  createIntent: controller.createIntent.bind(controller),
  stripeResponse: controller.createIntent.bind(controller),
};

export default checkoutHandlers;
