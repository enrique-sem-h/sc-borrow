import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // TODO: buscar saldo e transações do usuário logado
  return NextResponse.json({ saldo: 0, transacoes: [] });
}
