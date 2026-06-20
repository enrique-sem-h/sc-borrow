import { db } from "@/infra/database";
import {
  HistoricoPagamentoInsert,
  historicoPagamentos,
} from "@/infra/database/schemas/historicoPagamentoSchema";

class HistoricoPagamentoRepository {
  static async create(body: HistoricoPagamentoInsert) {
    const [resultId] = await db
      .insert(historicoPagamentos)
      .values(body)
      .$returningId();

    const historicoPagamento = await db.query.historicoPagamentos.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, resultId.id);
      },
    });

    return historicoPagamento;
  }
  static async getByUser(userId: string) {
    const historicoPagamento = await db.query.historicoPagamentos.findMany({
      where(fields, operators) {
        return operators.eq(fields.usuarioId, userId);
      },
      with: {
        aluguel: {
          with: {
            anuncio: true,
          },
        },
      },
    });

    return historicoPagamento;
  }
}

export default HistoricoPagamentoRepository;
