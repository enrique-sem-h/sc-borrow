import { eq, and } from "drizzle-orm";
import { db } from "@/infra/database/index";
import { avaliacoes } from "@/infra/database/schemas/avaliacoesSchema";
import { CreateAvaliacaoDTO, UpdateAvaliacaoDTO } from "../dtos/avaliacao-dto";
import { id } from "date-fns/locale";

class AvaliacaoRepository {
  static async create(body: CreateAvaliacaoDTO) {
    const [result] = await db.insert(avaliacoes).values(body).$returningId();
    const id = result.id;

    const avaliacao = await db
      .select()
      .from(avaliacoes)
      .where(eq(avaliacoes.id, id));

    return avaliacao[0];
  }

  static async read(id: string) {
    const avaliacao = await db
      .select()
      .from(avaliacoes)
      .where(eq(avaliacoes.id, id));

    return avaliacao[0];
  }

  static async list() {
    return await db.select().from(avaliacoes);
  }

  static async update(id: string, body: UpdateAvaliacaoDTO) {
    await db.update(avaliacoes).set(body).where(eq(avaliacoes.id, id));

    const avaliacao = await db
      .select()
      .from(avaliacoes)
      .where(eq(avaliacoes.id, id));

    return avaliacao[0];
  }

  static async delete(id: string) {
    await db.delete(avaliacoes).where(eq(avaliacoes.id, id));
  }

  static async findAluguelId(idAluguel: string, idUsuario: string) {
    const avaliacao = await db
    .select()
    .from(avaliacoes)
    .where(
      and(
        eq(avaliacoes.idAluguel, idAluguel),
        eq(avaliacoes.idUsuario, idUsuario),
      )

    );

    return avaliacao[0];
  }
}

export default AvaliacaoRepository;
