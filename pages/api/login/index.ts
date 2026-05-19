import { eq } from "drizzle-orm";
import { db } from "../../../infra/database/index";
import { usuarios } from "../../../infra/database/schemas/usuariosSchema";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido",
    });
  }

  const { email, cpf, password } = req.body;

  if ((!email && !cpf) || !password) {
    return res.status(400).json({
      error: "Dados incompletos.",
    });
  }

  let user;

  if (cpf) {
    user = await db.select().from(usuarios).where(eq(usuarios.cpf, cpf));
  } else {
    user = await db.select().from(usuarios).where(eq(usuarios.email, email));
  }

  const foundUser = user[0];

  if (!foundUser) {
    return res.status(401).json({
      error: "Usuário não encontrado.",
    });
  }

  if (foundUser.senha != password) {
    return res.status(401).json({
      error: "Senha incorreta.",
    });
  }

  return res.status(200).json({
    message: "Login realizado com sucesso.",
    user: {
      ...foundUser,
      senha: undefined,
    },
  });
}
