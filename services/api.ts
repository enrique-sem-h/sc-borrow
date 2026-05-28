import {
  UsuarioInsert,
  UsuarioLogin,
} from "@/infra/database/schemas/usuariosSchema";
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
}

const apiService = new ApiService();

export default apiService;
