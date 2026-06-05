import { AnuncioInsert } from "@/infra/database/schemas/anunciosSchema";
import {
  UsuarioInsert,
  UsuarioLogin,
} from "@/infra/database/schemas/usuariosSchema";
import { CreateAnuncioDTO } from "@/server/types";
import axios from "axios";

class ApiService {
  private api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
      Accept: "application/json",
    },
  });

  public async login(data: UsuarioLogin) {
    const response = await this.api.post("login", data);

    return response;
  }

  public async register(data: UsuarioInsert) {
    const response = await this.api.post("users", data);

    return response;
  }

  public setToken(token: string) {
    this.api.defaults.headers.Authorization = `Bearer ${token}`;
  }

  public anuncios = {
    insert: async (data: CreateAnuncioDTO) => {
      const formData = new FormData();
      const { fotos, ...restData } = data;
      for (const [key, value] of Object.entries(restData)) {
        formData.append(key, value);
      }

      fotos.forEach((foto) => {
        const parsed = foto as File;
        formData.append("fotos", parsed, parsed.name);
      });

      const response = await this.api.post("anuncio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    },
    getAll: async () => {
      const response = await this.api.get("anuncio");

      return response.data;
    },
    delete: async (id: string) => {
      const response = await this.api.delete(`anuncio/${id}`);

      return response.data;
    },
  };
}

const apiService = new ApiService();

export default apiService;
