import { eq } from "drizzle-orm";
import { db } from "../../../infra/database/index";
import { usuarios } from "../../../infra/database/schemas/usuariosSchema";

export default async function handler(req, res) {
  if (req.method === "POST") {
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

    let user;
    user = await db.select().from(usuarios).where(eq(usuarios.cpf, cpf));

    const foundUser = user[0];

    if (foundUser) {
      return res.status(409).json({
        error: " Este usuário já existe.",
      });
    }

    const [result] = await db.insert(usuarios).values({
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
    });

    // 2. Retrieve the inserted data using the insertId
    const newUser = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.id, result.insertId));

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      user: { ...newUser[0], senha: undefined },
    });
  }

  return res.status(405).json({
    error: "Método não permitido.",
  });
}
