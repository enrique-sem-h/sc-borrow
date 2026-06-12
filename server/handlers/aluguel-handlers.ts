import AluguelController from "../controllers/aluguel-controller";

const controller = new AluguelController();

const aluguelHandlers = {
  create: controller.create.bind(controller),
  read: controller.read.bind(controller),
  delete: controller.delete.bind(controller),
  update: controller.update.bind(controller),
  getAll: controller.getAll.bind(controller),
  dispatch: controller.dispatch.bind(controller),
  confirmReceived: controller.confirmReceived.bind(controller),
  cancel: controller.cancel.bind(controller),
};

export default aluguelHandlers;
