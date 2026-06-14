import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // TODO: integrar Stripe — processar pagamento
  return NextResponse.json({ success: true });
}
