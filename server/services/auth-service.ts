import UserRepository from "../repositories/user-repository";

class AuthService {
  public async register(body: any) {
    const foundUser = await UserRepository.findByCpf(body.cpf);

    if (foundUser) {
      return {
        error: "Este usuário já existe",
      };
    }

    const newUser = await UserRepository.create(body);

    return newUser;
  }

  public async login(body: any) {
    const { cpf, email, password } = body;

    let foundUser;

    if (cpf) {
      foundUser = await UserRepository.findByCpf(cpf);
    } else {
      foundUser = await UserRepository.findByEmail(email);
    }

    if (!foundUser) {
      return {
        error: "Usuário não encontrado",
      };
    }

    if (foundUser.senha != password) {
      return {
        error: "senha incorreta",
      };
    }

    return foundUser;
  }
}

export default AuthService;
