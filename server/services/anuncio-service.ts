import AnuncioRepository from "../repositories/anuncio-repository";
import { Anuncio, CreateAnuncioDTO, UpdateAnuncioDTO } from "../types";
import BaseService from "./base-service";

class AnuncioService extends BaseService {
  public create(body: CreateAnuncioDTO): Anuncio {
    console.log(body);

    return AnuncioRepository.create(body);
  }

  public update(body: UpdateAnuncioDTO) {
    return AnuncioRepository.update(body);
  }

  public read(id: string) {
    return AnuncioRepository.read(id);
  }

  public delete(id: string) {
    const anuncio = AnuncioRepository.read(id);

    if (!anuncio) {
      throw new Error("No anuncio with this id");
    }

    return AnuncioRepository.delete(id);
  }
}

export default AnuncioService;
