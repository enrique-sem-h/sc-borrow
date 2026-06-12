import { CreateFotoAnuncioDTO } from "../types";
import { fotoAnuncios } from "@/infra/database/schemas/anunciosSchema";
import { db } from "@/infra/database/index";
import { eq } from "drizzle-orm";

class FotoAnuncioRepository {
  static async create(body: CreateFotoAnuncioDTO) {
    // Chamar o Drizzle para subir url da foto
    await db.insert(fotoAnuncios).values(body);
    return body;
  }

  async findByAnuncio(anuncioId: string) {
    return db
      .select()
      .from(fotoAnuncios)
      .where(eq(fotoAnuncios.anuncioId, anuncioId))
      .orderBy(fotoAnuncios.ordem);
  }

  static async deleteByAnuncioId(anuncioId: string) {
    await db.delete(fotoAnuncios)
    .where(eq(fotoAnuncios.anuncioId, anuncioId))
  } 

  static async deleteById(id: string) {
    await db.delete(fotoAnuncios)
    .where(eq(fotoAnuncios.id, id))
  }
}

export default FotoAnuncioRepository;
