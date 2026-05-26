import { avaliacoes } from "@/infra/database/schemas/avaliacoesSchema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type CreateAvaliacaoDTO = {
  id?: string;
  nota: number;
  mensagem: string;
  idUsuario: string;
  idAluguel: string;
};

export type UpdateAvaliacaoDTO = Partial<CreateAvaliacaoDTO>;
export type Avaliacao = InferSelectModel<typeof avaliacoes>;
