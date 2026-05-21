import { Anuncio, CreateAnuncioDTO, UpdateAnuncioDTO } from "../types";
import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { db } from "@/infra/database/index";
import { eq } from "drizzle-orm";

class AnuncioRepository {
  static async create(body: CreateAnuncioDTO): Promise<Anuncio> {
    // Chamar o Drizzle para criar anuncio
    console.log("caiu");

    await db.insert(anuncios).values(body);
    console.log("inseriu");
    console.log(body as Anuncio);

    return body as Anuncio;
  }

  static update(body: UpdateAnuncioDTO): Anuncio {
    // Chamar o Drizzle para editar anuncio
  }

  static async read(id: string): Promise<Anuncio | undefined> {
    // Chamar o Drizzle para ler anuncio
    const [anuncio] = await db
      .select()
      .from(anuncios)
      .where(eq(anuncios.id, id))
      .limit(1);

    return anuncio;
  }

  static async delete(id: string): Promise<void> {
    // Chamar o Drizzle para deletar anuncio
    await db.delete(anuncios).where(eq(anuncios.id, id));
  }
}

export default AnuncioRepository;
