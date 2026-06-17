import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { alugueis } from "@/infra/database/schemas/alugueisSchema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { NextApiRequest } from "next";
import formidable from "formidable";

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type CreateAnuncioDTO = {
  titulo: string;
  descricao: string;
  categoria: "Ferramentas" | "Camping" | "Equipamentos de festa" | "Lazer";
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
