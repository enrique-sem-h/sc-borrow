import { Anuncio, CreateAnuncioDTO, UpdateAnuncioDTO } from "../types";

class UserRepository {
  static create(body: CreateAnuncioDTO): Anuncio {
    // Chamar o Drizzle para criar anuncio
  }

  static update(body: UpdateAnuncioDTO): Anuncio {
    // Chamar o Drizzle para editar anuncio
  }

  static read(id: string): Anuncio {
    // Chamar o Drizzle para ler anuncio
  }

  static delete(id: string): void {
    // Chamar o Drizzle para deletar anuncio
  }
}

export default UserRepository;
