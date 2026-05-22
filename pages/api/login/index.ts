import authHandlers from "../../../server/handlers/auth-handlers";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return authHandlers.login(req, res);
  }

  return res.status(405).json({
    error: "Método não permitido",
  });
}
