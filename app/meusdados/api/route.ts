import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  // TODO: atualizar dados do usuário logado no banco
  return NextResponse.json({ success: true });
}
