import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { alugueis } from "@/infra/database/schemas/alugueisSchema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { NextApiRequest } from "next";
import formidable from "formidable";

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

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
  fotos: File[] | formidable.File[];
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

export type Aluguel = InferSelectModel<typeof alugueis>;
export type CreateAluguelDTO = Optional<Aluguel, "id">;
export type UpdateAluguelDTO = Omit<
  Aluguel,
  "id" | "idAnuncio" | "idLocador" | "idLocatario"
>;

export interface NextAuthMiddlewareApiRequest extends NextApiRequest {
  userId?: string;
}

export interface NextAuthApiRequest extends NextApiRequest {
  userId: string;
}

export interface NextFormApiRequest extends NextApiRequest {
  files?: formidable.Files<string>;
}
