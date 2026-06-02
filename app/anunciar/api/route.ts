import { NextResponse } from "next/server";
import { db } from "@/infra/database";
import { anuncios } from "@/infra/database/schemas/anunciosSchema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, descricao, categoria, valor_diario, caucao } = body;

    if (!titulo || !descricao || !categoria || !valor_diario || !caucao) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    // trocar dps
    const usuarioLogadoId = "user-teste-123";

    const novoAnuncioId = crypto.randomUUID();

    await db.insert(anuncios).values({
      id: novoAnuncioId,
      titulo,
      descricao,
      categoria,
      valorDiario: parseFloat(valor_diario),
      caucao: parseFloat(caucao),
      usuarioId: usuarioLogadoId,
    });

    return NextResponse.json({ success: true, id: novoAnuncioId }, { status: 201 });

  } catch (error) {
    console.error("Erro ao criar anúncio no banco:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}