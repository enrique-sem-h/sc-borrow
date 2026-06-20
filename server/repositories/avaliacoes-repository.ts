import { eq, and, or } from "drizzle-orm";
import { db } from "@/infra/database/index";
import { avaliacoes } from "@/infra/database/schemas/avaliacoesSchema";
import { CreateAvaliacaoDTO, UpdateAvaliacaoDTO } from "../dtos/avaliacao-dto";
import { id } from "date-fns/locale";
import { alugueis } from "@/infra/database/schemas/alugueisSchema";

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

  static async findByAluguelId(idAluguel: string, idUsuario: string) {
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


  static async calcularReputacaoRecebida(idUsuarioAvaliado: string) {
    const avaliacoesRecebidas = await db
      .select({
        nota: avaliacoes.nota,
      })
      .from(avaliacoes)
      .innerJoin(alugueis, eq(avaliacoes.idAluguel, alugueis.id))
      .where(
        or(
          and(
            eq(alugueis.idLocador, idUsuarioAvaliado),
            eq(avaliacoes.idUsuario, alugueis.idLocatario),
          ),
          and(
            eq(alugueis.idLocatario, idUsuarioAvaliado),
            eq(avaliacoes.idUsuario, alugueis.idLocador),
          ),
        ),
      );

    if (!avaliacoesRecebidas.length) {
      return 0;
    }

    const soma = avaliacoesRecebidas.reduce((total, avaliacao) => {
      return total + Number(avaliacao.nota);
    }, 0);

    const media = soma / avaliacoesRecebidas.length;

    return Number(media.toFixed(2));
  }
  
}

export default AvaliacaoRepository;
