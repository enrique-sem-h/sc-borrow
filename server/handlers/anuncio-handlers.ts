import AnuncioController from "../controllers/anuncio-controller";

const controller = new AnuncioController();

const anuncioHandlers = {
  getAll: controller.getAll.bind(controller),
  create: controller.create.bind(controller),
  read: controller.read.bind(controller),
  delete: controller.delete.bind(controller),
  update: controller.update.bind(controller),
};

export default anuncioHandlers;
