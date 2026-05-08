export const users = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const { userName, phone, email, cpf, password, confirmPassword, address } =
      req.body;

    if (
      !userName ||
      !phone ||
      !email ||
      !cpf ||
      !password ||
      !confirmPassword ||
      !address
    ) {
      return res.status(400).json({
        error: "Dados incompletos.",
      });
    }

    const newUser = {
      id: Date.now(),
      userName,
      phone,
      email,
      cpf,
      password,
      confirmPassword,
      address,
    };

    users.push(newUser);

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      user: newUser,
    });
  }

  return res.status(405).json({
    error: "Método não permitido.",
  });
}
