import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // TODO: buscar histórico de aluguéis concluídos do usuário logado
  return NextResponse.json([]);
}
