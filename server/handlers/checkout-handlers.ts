import CheckoutController from "../controllers/checkout-controller";

const controller = new CheckoutController();

const checkoutHandlers = {
  createIntent: controller.createIntent.bind(controller),
  stripeResponse: controller.stripeResponse.bind(controller),
  finalize: controller.finalize.bind(controller),
};

export default checkoutHandlers;
