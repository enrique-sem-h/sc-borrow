import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { InferInsertModel } from "drizzle-orm";

export type CreateAnuncioDTO = {
  id?: string;
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

export type userParse = {
  id: string;
  nome: number;
  email: boolean;
};

export type CreateFotoAnuncioDTO = {
  anuncioId: string;
  url: string;
  ordem: number;
  principal: boolean;
};
