import { NextApiRequest, NextApiResponse } from "next";
import AuthService from "../services/auth-service";

class AuthController {
  private authService = new AuthService();

  public async register(req: NextApiRequest, res: NextApiResponse) {
    const {
      nome,
      telefone,
      email,
      cpf,
      senha,
      cep,
      logradouro,
      bairro,
      numero,
      uf,
      complemento,
      rep,
    } = req.body;

    if (!nome || !telefone || !email || !cpf || !senha) {
      return res.status(400).json({
        error: "Dados incompletos.",
      });
    }

    const result = (await this.authService.register({
      nome,
      telefone,
      email,
      cpf,
      senha,
      cep,
      logradouro,
      bairro,
      numero,
      uf,
      complemento,
      rep,
    })) as { error?: string; [key: string]: any };

    if (result.error) {
      return res.status(409).json({
        error: result.error,
      });
    }

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      user: {
        ...result,
        senha: undefined,
      },
    });
  }

  public async login(req: NextApiRequest, res: NextApiResponse) {
    const { email, cpf, password } = req.body;

    if ((!email && !cpf) || !password) {
      return res.status(400).json({
        error: "Dados incompletos.",
      });
    }

    const result = await this.authService.login({
      email,
      cpf,
      password,
    });

    if (result.error === "Usuário não encontrado") {
      return res.status(401).json({
        error: result.error,
      });
    }

    if (result.error === "senha incorreta") {
      return res.status(401).json({
        error: result.error,
      });
    }

    return res.status(200).json({
      message: "Login realizado com sucesso.",
      user: {
        ...result.user,
        senha: undefined,
      },
      token: result.token,
    });
  }
}

export default AuthController;
