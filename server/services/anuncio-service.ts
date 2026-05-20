import formidable from "formidable";
import AnuncioRepository from "../repositories/anuncio-repository";
import FotoAnuncioService from "../services/foto-anuncio-service";
import { Anuncio, CreateAnuncioDTO, UpdateAnuncioDTO } from "../types";
import BaseService from "./base-service";
import { randomUUID } from "node:crypto";

class AnuncioService extends BaseService {
  public async create(body: CreateAnuncioDTO, fotos: formidable.File[]): Promise<Anuncio> {
    const fotoAnuncioService = new FotoAnuncioService();
    const anuncioId = randomUUID();

    body.id = anuncioId;
    await AnuncioRepository.create(body);

    // upload das fotos
    await fotoAnuncioService.bulkUpload(anuncioId, fotos);
    return body as Anuncio;
  }

  public update(body: UpdateAnuncioDTO) {
    return AnuncioRepository.update(body);
  }

  public read(id: string) {
    return AnuncioRepository.read(id);
  }

  public delete(id: string) {
    return AnuncioRepository.delete(id);
  }
}

export default AnuncioService;
