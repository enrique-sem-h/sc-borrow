import { alugueis } from "@/infra/database/schemas/alugueisSchema";
import { db } from "@/infra/database/index";
import { eq } from "drizzle-orm";
import { usuarios } from "@/infra/database/schemas/usuariosSchema";
import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { Aluguel, CreateAluguelDTO, UpdateAluguelDTO } from "../types";

class AluguelRepository {
  static async create(body: CreateAluguelDTO): Promise<Aluguel> {
    // Chamar o Drizzle para criar anuncio

    const [result] = await db.insert(alugueis).values(body).$returningId();
    const id = result.id;

    const [aluguel] = await db
      .select()
      .from(alugueis)
      .where(eq(alugueis.id, id));

    return aluguel;
  }

  static async update(id: string, body: UpdateAluguelDTO): Promise<Aluguel> {
    // Chamar o Drizzle para editar anuncio
    //
    await db.update(alugueis).set(body).where(eq(alugueis.id, id));

    const [result] = await db
      .select()
      .from(alugueis)
      .where(eq(alugueis.id, id));

    return result;
  }

  static async read(id: string): Promise<Aluguel | undefined> {
    // Chamar o Drizzle para ler anuncio
    const [aluguel] = await db
      .select()
      .from(alugueis)
      .where(eq(alugueis.id, id))
      .limit(1);

    return aluguel;
  }

  static async delete(id: string): Promise<void> {
    // Chamar o Drizzle para deletar anuncio
    await db.delete(alugueis).where(eq(alugueis.id, id));
  }
}

export default AluguelRepository;
