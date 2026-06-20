import {
  Anuncio,
  AnuncioInsert,
} from "@/infra/database/schemas/anunciosSchema";
import { HistoricoPagamento } from "@/infra/database/schemas/historicoPagamentoSchema";
import {
  Usuario,
  UsuarioInsert,
  UsuarioLogin,
} from "@/infra/database/schemas/usuariosSchema";
import { AluguelTipo } from "@/server/controllers/aluguel-controller";
import type { Aluguel, CreateAnuncioDTO, NotificacaoDTO } from "@/server/types";
import axios from "axios";

export type AnuncioDetalhado = Anuncio & {
  fotos: {
    id: string;
    url: string;
    ordem: number;
    principal: boolean;
    anuncioId: string;
  }[];
  locador: Usuario;
  datasBloqueadas?: {
    dataInicio: string;
    dataFim: string;
  }[];
};

type AnuncioEditPayload = Partial<Omit<CreateAnuncioDTO, "fotos">> & {
  fotos?: unknown[];
};

class ApiService {
  private api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
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

  public users = {
    carteira: async (): Promise<{
      data: (HistoricoPagamento & {
        aluguel: Aluguel & {
          anuncio: Anuncio;
        };
      })[];
    }> => {
      const response = await this.api.get("/users/carteira");

      return response.data;
    },

    saldo: async (): Promise<{
      data: number;
    }> => {
      const response = await this.api.get("/users/saldo");

      return response.data;
    },
    rep: async (): Promise<{
      data: number;
    }> => {
      const response = await this.api.get("/users/rep");

      return response.data;
    },
  };

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
    get: async (
      id: string,
    ): Promise<{
      data: Aluguel & {
        locador: Usuario;
        locatario: Usuario;
        anuncio: Anuncio & {
          fotos: {
            url: string;
            principal: string;
          }[];
        };
      };
    }> => {
      const response = await this.api.get(`aluguel/${id}`);

      return response.data;
    },

    changeStatus: async (id: string, status: Aluguel["status"]) => {
      let route: string;
      switch (status) {
        case "WAITING_FOR_DISPATCH":
          route = "/confirm-aluguel";
          break;
        case "WAITING_FOR_DELIVERY":
          route = "/dispatch";
          break;
        case "ITEM_IN_HAND":
          route = "/confirm-received";
          break;
        case "WAITING_FOR_RETURN_CONFIRM":
          route = "/confirm-returning";
          break;
        case "COMPLETED":
          route = "/confirm-returned-item";
          break;
        case "CANCELLED":
          route = "/cancel";
          break;
        default:
          throw new Error("Invalid status");
      }

      const endpoint = `aluguel/${id}${route}`;
      console.log("Changing status", id, status, endpoint);

      const response = await this.api.post(endpoint);

      return response.data;
    },
  };

  public notificacoes = {
    getAll: async (): Promise<{ data: NotificacaoDTO[] }> => {
      const response = await this.api.get("notificacoes");

      return response.data;
    },
    markAsRead: async (id: string): Promise<{ data: NotificacaoDTO }> => {
      const response = await this.api.patch(`notificacoes/${id}`);

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
    edit: async (id: string, newData: AnuncioEditPayload) => {
      const formData = new FormData();
      const { fotos, ...restData } = newData;

      for (const [key, value] of Object.entries(restData)) {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }

      if (Array.isArray(fotos)) {
        fotos.forEach((foto) => {
          if (foto instanceof File) {
            formData.append("fotos", foto, foto.name);
          }
        });
      }

      const response = await this.api.put(`anuncio/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },
  };

  public avaliacoes = {
    create: async (data: {
      nota: number;
      mensagem: string;
      idUsuario: string;
      idAluguel: string;
    }) => {
      const response = await this.api.post("avaliacao", data);
      return response.data;
    },

    getByAluguel: async (idAluguel: string, idUsuario: string) => {
      const response = await this.api.get(
        `avaliacao/aluguel/${idAluguel}?idUsuario=${idUsuario}`,
      );
      return response.data;
    },
  };
}

const apiService = new ApiService();

export default apiService;
