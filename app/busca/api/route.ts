import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q         = searchParams.get("q") ?? "";
  const categoria = searchParams.get("categoria") ?? "";

  // TODO: buscar anúncios no banco filtrando por q e categoria
  return NextResponse.json([]);
}
