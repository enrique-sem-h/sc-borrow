import { CreateAnuncioDTO, UpdateAnuncioDTO } from "../types";
import {
  Anuncio,
  anuncios,
  fotoAnuncios,
} from "@/infra/database/schemas/anunciosSchema";
import { db } from "@/infra/database/index";
import { eq } from "drizzle-orm";
import { usuarios } from "@/infra/database/schemas/usuariosSchema";

class AnuncioRepository {
  static async getAll(userId: string): Promise<Anuncio[]> {
    // Chamar o Drizzle para criar anuncio

    const results = await db.query.anuncios.findMany({
      where(fields, operators) {
        return operators.eq(fields.usuarioId, userId);
      },
      with: { fotos: true },
    });

    return results;
  }
  static async create(body: CreateAnuncioDTO): Promise<Anuncio> {
    // Chamar o Drizzle para criar anuncio

    const [result] = await db.insert(anuncios).values(body).$returningId();
    const id = result.id;

    const [anuncio] = await db
      .select()
      .from(anuncios)
      .where(eq(anuncios.id, id));

    return anuncio;
  }

  static async update(id: string, body: UpdateAnuncioDTO): Promise<Anuncio> {
    // Chamar o Drizzle para editar anuncio
    //
    await db.update(anuncios).set(body).where(eq(anuncios.id, id));

    const [result] = await db
      .select()
      .from(anuncios)
      .where(eq(anuncios.id, id));

    return result;
  }

  static async read(id: string): Promise<Anuncio | undefined> {
    // Chamar o Drizzle para ler anuncio
    //
    const anuncio = await db.query.anuncios.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, id);
      },
      with: { fotos: true },
    });

    return anuncio;
  }

  static async delete(id: string): Promise<void> {
    // Chamar o Drizzle para deletar anuncio
    await db.delete(anuncios).where(eq(anuncios.id, id));
  }
}

export default AnuncioRepository;
