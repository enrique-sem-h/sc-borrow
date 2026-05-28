import { UsuarioInsert } from "@/infra/database/schemas/usuariosSchema";
import axios from "axios";

class ApiService {
  private api = axios.create({
    baseURL: "/api",
    headers: {
      Accept: "application/json",
    },
  });

  public login() {}

  public async register(data: UsuarioInsert) {
    console.log("register");

    const response = await this.api.post("users", data);

    return response;
  }
}

const apiService = new ApiService();

export default apiService;
