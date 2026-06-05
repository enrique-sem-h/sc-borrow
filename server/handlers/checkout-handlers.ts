import CheckoutController from "../controllers/checkout-controller";

const controller = new CheckoutController();

const checkoutHandlers = {
  create: controller.create.bind(controller),
};

export default checkoutHandlers;
