import {
  Anuncio,
  AnuncioInsert,
} from "@/infra/database/schemas/anunciosSchema";
import {
  Usuario,
  UsuarioInsert,
  UsuarioLogin,
} from "@/infra/database/schemas/usuariosSchema";
import { AluguelTipo } from "@/server/controllers/aluguel-controller";
import { Aluguel, CreateAnuncioDTO, UpdateAnuncioDTO } from "@/server/types";
import axios from "axios";

type AnuncioDetalhado = Anuncio & {
  fotos: {
    id: string;
    url: string;
    ordem: number;
    principal: boolean;
    anuncioId: string;
  }[];

  datasBloqueadas?: {
    dataInicio: string;
    dataFim: string;
  }[];
};

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

  public alugueis = {
    getAll: async (
      type?: AluguelTipo,
    ): Promise<{
      data: (Aluguel & {
        anuncio: Anuncio;
        locador: Usuario;
        locatario: Usuario;
      })[];
    }> => {
      const query = !type ? "" : `tipo=${type}`;
      const response = await this.api.get(`aluguel?${query}`);

      return response.data;
    },
  };

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
    getAll: async (): Promise<{
      data: {
        anuncios: Anuncio[];
      };
    }> => {
      const response = await this.api.get("anuncio");

      return response.data;
    },
    get: async (
      id: string,
    ): Promise<{
      data: AnuncioDetalhado;
    }> => {
      const response = await this.api.get(`anuncio/${id}`);

      return response.data;
    },
    delete: async (id: string) => {
      const response = await this.api.delete(`anuncio/${id}`);

      return response.data;
    },
    edit: async (id: string, newData: UpdateAnuncioDTO) => {
      const response = await this.api.put(`anuncio/${id}`, newData);

      return response.data;
    },
  };
}

const apiService = new ApiService();

export default apiService;
