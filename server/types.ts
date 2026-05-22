import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { InferInsertModel } from "drizzle-orm";

export type CreateAnuncioDTO = {
  titulo: string;
  descricao: string;
  categoria:
    | "Moda e Acessórios"
    | "Eletrônicos"
    | "Beleza e Cuidados"
    | "Casa e decoração"
    | "Animais e Acessórios";
  valorDiario: number;
  caucao: number;
  usuarioId: string;
};

export type UpdateAnuncioDTO = InferInsertModel<typeof anuncios>;

export type Anuncio = {};
