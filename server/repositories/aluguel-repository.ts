import { alugueis, AluguelType } from "@/infra/database/schemas/alugueisSchema";
import { db } from "@/infra/database/index";
import { eq } from "drizzle-orm";
import { usuarios } from "@/infra/database/schemas/usuariosSchema";
import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { Aluguel, CreateAluguelDTO, UpdateAluguelDTO } from "../types";
import { AluguelTipo } from "../controllers/aluguel-controller";

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

  static async update(
    id: string,
    body: Partial<AluguelType>,
  ): Promise<Aluguel> {
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
    const aluguel = await db.query.alugueis.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, id);
      },
    });

    return aluguel;
  }

  static async getAlugueisComoLocatarioByUser(
    userId: string,
  ): Promise<Aluguel[] | undefined> {
    // Chamar o Drizzle para ler anuncio
    const alugueis = db.query.alugueis.findMany({
      where(fields, operators) {
        return operators.eq(fields.idLocatario, userId);
      },
    });

    return alugueis;
  }

  static async getAlugueisComoLocadorByUser(
    userId: string,
  ): Promise<Aluguel[] | undefined> {
    // Chamar o Drizzle para ler anuncio
    const alugueis = db.query.alugueis.findMany({
      where(fields, operators) {
        return operators.eq(fields.idLocador, userId);
      },
    });

    return alugueis;
  }

  static async delete(id: string): Promise<void> {
    // Chamar o Drizzle para deletar anuncio
    await db.delete(alugueis).where(eq(alugueis.id, id));
  }

  static async getByUser(
    userId: string,
    type: AluguelTipo | undefined,
  ): Promise<Aluguel[] | undefined> {
    const alugueis = db.query.alugueis.findMany({
      where(fields, operators) {
        if (!type) {
          return operators.or(
            operators.eq(fields.idLocador, userId),
            operators.eq(fields.idLocatario, userId),
          );
        }

        if (type === "locador") {
          return operators.eq(fields.idLocador, userId);
        }
        if (type === "locatario") {
          return operators.eq(fields.idLocatario, userId);
        }
      },
    });

    return alugueis;
  }
}

export default AluguelRepository;
