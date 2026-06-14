import AluguelController from "../controllers/aluguel-controller";

const controller = new AluguelController();

const anuncioHandlers = {
  create: controller.create.bind(controller),
  read: controller.read.bind(controller),
  delete: controller.delete.bind(controller),
  update: controller.update.bind(controller),
  getAll: controller.getAll.bind(controller),
};

export default anuncioHandlers;
