import { users } from "../users/index";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido",
    });
  }

  const { email, cpf, password } = req.body;

  if (!email || !cpf || !password) {
    return res.status(400).json({
      error: "Dados incompletos.",
    });
  }

  const user = users.find((user) => user.cpf === cpf);

  if (!user) {
    return res.status(401).json({
      error: "Usuário não encontrado.",
    });
  }

  if (user.password != password) {
    return res.status(401).json({
      error: "Senha incorreta.",
    });
  }

  return res.status(200).json({
    message: "Login realizado com sucesso.",
  });
}
