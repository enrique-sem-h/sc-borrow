import formidable from "formidable";
import AnuncioRepository from "../repositories/anuncio-repository";
import FotoAnuncioService from "../services/foto-anuncio-service";
import { Anuncio, CreateAnuncioDTO, UpdateAnuncioDTO } from "../types";
import BaseService from "./base-service";
import { randomUUID } from "node:crypto";

class AnuncioService extends BaseService {
  public async create(
    body: CreateAnuncioDTO,
    fotos: formidable.File[],
  ): Promise<Anuncio> {
    const fotoAnuncioService = new FotoAnuncioService();
    const anuncioId = randomUUID();

    body.id = anuncioId;
    const anuncio = await AnuncioRepository.create(body);

    // upload das fotos
    await fotoAnuncioService.bulkUpload(anuncioId, fotos);
    return anuncio;
  }

  public async update(id: string, body: UpdateAnuncioDTO) {
    return AnuncioRepository.update(id, body);
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
