import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // TODO: criar o aluguel no banco para o usuário logado
  return NextResponse.json({ success: true });
}
