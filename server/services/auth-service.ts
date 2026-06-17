import UserRepository from "../repositories/user-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
  public async register(body: any) {
    const foundUserByCpf = await UserRepository.findByCpf(body.cpf);

    if (foundUserByCpf) {
      return {
        error: "CPF já cadastrado.",
      };
    }

    const foundUserByEmail = await UserRepository.findByEmail(body.email);

    if (foundUserByEmail) {
      return {
        error: "E-mail já cadastrado.",
      };
    }

    const hashed_Password = await bcrypt.hash(body.senha, 10);
    body.senha = hashed_Password;
    const newUser = await UserRepository.create(body);

    return newUser;
  }

  public async login(body: any) {
    const { cpf, email, senha } = body;

    const foundUser = await UserRepository.findByEmail(email);

    if (!foundUser) {
      return {
        error: "Usuário não encontrado",
      };
    }

    const passwordMatch = await bcrypt.compare(senha, foundUser.senha);

    if (!passwordMatch) {
      return {
        error: "senha incorreta",
      };
    }

    const token = jwt.sign(
      { id: foundUser.id, email: foundUser.email },
      process.env.SECRET as string,
      { expiresIn: "1d" },
    );

    return { user: foundUser, token };
  }
}

export default AuthService;
