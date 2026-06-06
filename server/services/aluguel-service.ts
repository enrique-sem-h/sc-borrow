import { AluguelTipo } from "../controllers/aluguel-controller";
import AluguelRepository from "../repositories/aluguel-repository";
import { Aluguel, CreateAluguelDTO, UpdateAluguelDTO } from "../types";
import BaseService from "./base-service";

class AluguelService extends BaseService {
  public async create(body: CreateAluguelDTO): Promise<Aluguel> {
    return await AluguelRepository.create(body);
  }

  public async update(id: string, body: UpdateAluguelDTO) {
    return AluguelRepository.update(id, body);
  }

  public read(id: string) {
    return AluguelRepository.read(id);
  }

  public getAll(userId: string, type: AluguelTipo | undefined) {
    return AluguelRepository.getByUser(userId, type);
  }
  public delete(id: string) {
    const anuncio = AluguelRepository.read(id);

    if (!anuncio) {
      throw new Error("No anuncio with this id");
    }

    return AluguelRepository.delete(id);
  }
}

export default AluguelService;
