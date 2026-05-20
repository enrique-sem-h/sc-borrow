import { Anuncio, CreateAnuncioDTO, UpdateAnuncioDTO } from "../types";
import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { db } from "@/infra/database/index";

class AnuncioRepository {
  static async create(body: CreateAnuncioDTO): Promise<Anuncio> {
    // Chamar o Drizzle para criar anuncio
    await db.insert(anuncios).values(body);
    
    return body as Anuncio;
  }

  static update(body: UpdateAnuncioDTO): Anuncio {
    // Chamar o Drizzle para editar anuncio
  }

  static read(id: string): Anuncio {
    // Chamar o Drizzle para ler anuncio
  }

  static delete(id: string): void {
    // Chamar o Drizzle para deletar anuncio
  }
}

export default AnuncioRepository;
