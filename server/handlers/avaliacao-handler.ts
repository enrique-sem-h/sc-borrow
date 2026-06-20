import AvaliacaoController from "../controllers/avaliacao-controller";

const controller = new AvaliacaoController();

const avaliacaoHandlers = {
  create: controller.create.bind(controller),
  read: controller.read.bind(controller),
  findByAluguelId: controller.findByAluguelId.bind(controller),
  list: controller.list.bind(controller),
  update: controller.update.bind(controller),
  delete: controller.delete.bind(controller),
};

export default avaliacaoHandlers;
