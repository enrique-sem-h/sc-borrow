"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";

function PagamentoContent() {
  const router = useRouter();
  const params = useSearchParams();

  if (!params) return null;

  const titulo      = params.get("titulo") ?? "";
  const valorDiario = parseFloat(params.get("valorDiario") ?? "0");
  const totalDias   = parseInt(params.get("totalDias") ?? "0");
  const caucao      = parseFloat(params.get("caucao") ?? "0");
  const taxaServico = 12.00;
  const valorAluguel = valorDiario * totalDias;
  const valorTotal   = valorAluguel + caucao + taxaServico;

  const onConfirmar = async () => {
    // TODO: integrar Stripe aqui
    router.push("/meusalugueis");
  };

  return (
    <main className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-8 py-10">

        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-600"
          >
            <ChevronLeft size={26} />
          </button>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Método de pagamento
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* Lado esquerdo — área do Stripe */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="border border-gray-200 rounded-[20px] min-h-[320px] flex items-center justify-center text-gray-300 text-sm italic">
              {/* TODO: integrar Stripe aqui */}
            </div>

            <button
              onClick={onConfirmar}
              className="w-full py-4 bg-green-300 hover:bg-green-400 transition rounded-xl font-serif text-lg font-bold text-gray-800"
            >
              Confirmar Pedido
            </button>
          </div>

          {/* Lado direito — resumo do pedido */}
          <div className="w-full md:w-80 border border-gray-200 rounded-[20px] p-6 shadow-sm shrink-0">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Valor (R$ {valorDiario.toFixed(2)} × {totalDias} dias)</span>
                <span>R$ {valorAluguel.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Taxa de serviço</span>
                <span>R$ {taxaServico.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Caução</span>
                <span>R$ {caucao.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Total do Pedido:</span>
                <span className="text-xl font-bold text-gray-900">
                  R$ {valorTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function PagamentoPage() {
  return (
    <Suspense>
      <PagamentoContent />
    </Suspense>
  );
}
