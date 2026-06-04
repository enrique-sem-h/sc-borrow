import formidable from "formidable";
import AnuncioRepository from "../repositories/anuncio-repository";
import FotoAnuncioService from "../services/foto-anuncio-service";
import { Anuncio, CreateAnuncioDTO, UpdateAnuncioDTO } from "../types";
import BaseService from "./base-service";
import { randomUUID } from "node:crypto";
import { AnuncioInsert } from "@/infra/database/schemas/anunciosSchema";

class AnuncioService extends BaseService {
  public async getAll(userId: string) {
    return AnuncioRepository.getAll(userId);
  }

  public async create(
    body: CreateAnuncioDTO,
    userId: string,
  ): Promise<Anuncio> {
    const fotoAnuncioService = new FotoAnuncioService();
    const anuncioId = randomUUID();

    const payload: AnuncioInsert = {
      ...body,
      usuarioId: userId,
    };

    const fotos = body.fotos as formidable.File[];

    body.id = anuncioId;
    const anuncio = await AnuncioRepository.create(payload);

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
