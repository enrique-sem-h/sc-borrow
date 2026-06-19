import NotificacoesController from "../controllers/notificacoes-controller";

const controller = new NotificacoesController();

const notificacoesHandlers = {
  getAll: controller.getAll.bind(controller),
  markAsRead: controller.markAsRead.bind(controller),
};

export default notificacoesHandlers;
