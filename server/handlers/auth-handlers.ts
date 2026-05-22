import AuthController from "../controllers/auth-controller";

const controller = new AuthController();

const authHandlers = {
  register: controller.register.bind(controller),
  login: controller.login.bind(controller),
};

export default authHandlers;
