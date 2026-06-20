import UserController from "../controllers/user-controller";

const controller = new UserController();

const userHandlers = {
  getCarteira: controller.getCarteira.bind(controller),
  getSaldo: controller.getSaldo.bind(controller),
  rep: controller.getRep.bind(controller),
  resgatar: controller.resgatarSaldo.bind(controller),
};

export default userHandlers;
