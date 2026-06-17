import { alugueis } from "@/infra/database/schemas/alugueisSchema";
import { db } from "@/infra/database/index";
import { and, eq, gte, lte } from "drizzle-orm";
import { Aluguel, CreateAluguelDTO, UpdateAluguelDTO } from "../types";
import { AluguelTipo } from "../controllers/aluguel-controller";
import { fotoAnuncios } from "@/infra/database/schemas/anunciosSchema";

class AluguelRepository {
  static async create(body: CreateAluguelDTO): Promise<Aluguel> {
    const [result] = await db.insert(alugueis).values(body).$returningId();
    const id = result.id;

    const [aluguel] = await db
      .select()
      .from(alugueis)
      .where(eq(alugueis.id, id));

    return aluguel;
  }

  static async update(id: string, body: UpdateAluguelDTO): Promise<Aluguel> {
    await db.update(alugueis).set(body).where(eq(alugueis.id, id));

    const [result] = await db
      .select()
      .from(alugueis)
      .where(eq(alugueis.id, id));

    return result;
  }

  static async read(id: string) {
    return db.query.alugueis.findFirst({
      with: {
        locador: true,
        locatario: true,
        anuncio: {
          with: { fotos: true },
        },
      },
      where(fields, operators) {
        return operators.eq(fields.id, id);
      },
    });
  }

  static async getAlugueisComoLocatarioByUser(
    userId: string,
  ): Promise<Aluguel[] | undefined> {
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
    const alugueis = db.query.alugueis.findMany({
      where(fields, operators) {
        return operators.eq(fields.idLocador, userId);
      },
    });

    return alugueis;
  }

  static async delete(id: string): Promise<void> {
    await db.delete(alugueis).where(eq(alugueis.id, id));
  }

  static async getByUser(
    userId: string,
    type: AluguelTipo | undefined,
  ): Promise<Aluguel[] | undefined> {
    const alugueis = db.query.alugueis.findMany({
      with: {
        locador: true,
        locatario: true,
        anuncio: {
          with: {
            fotos: true,
          },
        },
      },
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

  static async findConflictAnuncio(
    idAnuncio: string,
    dataInicio: Date,
    dataFim: Date,
  ) {
    const [aluguel] = await db
      .select()
      .from(alugueis)
      .where(
        and(
          eq(alugueis.idAnuncio, idAnuncio),
          lte(alugueis.dataInicio, dataFim),
          gte(alugueis.dataFim, dataInicio),
        ),
      )
      .limit(1);

    return aluguel;
  }
}

export default AluguelRepository;
