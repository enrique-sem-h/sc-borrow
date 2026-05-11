import AnuncioController from "../controllers/anuncio-controller"

const controller = new AnuncioController()

const anuncioHandlers = {
  create: controller.create,
  read: controller.read,
  delete: controller.delete,
  update: controller.update,
}

export default anuncioHandlers 
