import UserRepository from "../repositories/user-repository";
import bcrypt from "bcrypt";

class AuthService {
  public async register(body: any) {
    const foundUser = await UserRepository.findByCpf(body.cpf);

    if (foundUser) {
      return {
        error: "Este usuário já existe",
      };
    }

    const hashed_Password = await bcrypt.hash(body.senha, 10);
    body.senha = hashed_Password;
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

    const passwordMatch = await bcrypt.compare(password, foundUser.senha);

    if (!passwordMatch) {
      return {
        error: "senha incorreta",
      };
    }

    return foundUser;
  }
}

export default AuthService;
