"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/forms/CheckoutForm";

// npm install @stripe/react-stripe-js @stripe/stripe-js  | se precisar

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

function PagamentoContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [clientSecret, setClientSecret] = useState("");
  const [erroDatas, setErroDatas] = useState<string | null>(null);

  const idAnuncio = params?.get("idAnuncio") ?? "";
  const idLocatario = params?.get("idLocatario") ?? "";
  const titulo = params?.get("titulo") ?? "";
  const dataInicio = params?.get("dataInicio") ?? "";
  const dataFim = params?.get("dataFim") ?? "";
  const valorDiario = parseFloat(params?.get("valorDiario") ?? "0");
  const totalDias = parseInt(params?.get("totalDias") ?? "0");
  const caucao = parseFloat(params?.get("caucao") ?? "0");
  const valorAluguel = valorDiario * totalDias;
  const taxaServico = valorAluguel * 0.12;
  const valorTotal = valorAluguel + caucao + taxaServico;

  useEffect(() => {
    if (!idAnuncio || !idLocatario || !dataInicio || !dataFim) return;

    const token = localStorage.getItem("token") ?? "";

    fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        valor: Math.round(valorTotal * 100),
        idAnuncio,
        idLocatario,
        dataInicio: new Date(dataInicio).toISOString(),
        dataFim: new Date(dataFim).toISOString(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErroDatas(data.error);
        } else {
          setClientSecret(data.clientSecret);
        }
      })
      .catch((error) =>
        console.error("Erro ao criar intent de pagamento: ", error),
      );
  }, [idAnuncio, idLocatario, dataInicio, dataFim, valorTotal]);

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  if (!params) return null;

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
            <div className="border border-gray-200 rounded-[20px] min-h-[320px] flex items-center justify-center text-gray-300 text-sm italic p-6">
              {erroDatas ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <p className="text-red-500 font-semibold">{erroDatas}</p>
                  <button
                    onClick={() => router.back()}
                    className="px-6 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition"
                  >
                    Voltar e escolher outras datas
                  </button>
                </div>
              ) : clientSecret ? (
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm
                    itemNome={titulo}
                    valorTotal={`R$ ${valorTotal.toFixed(2).replace(".", ",")}`}
                  />
                </Elements>
              ) : (
                <p style={{ textAlign: "center" }}>
                  Carregando opções de pagamento...
                </p>
              )}
            </div>
          </div>

          {/* Lado direito — resumo do pedido */}
          <div className="w-full md:w-80 border border-gray-200 rounded-[20px] p-6 shadow-sm shrink-0">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  Valor (R$ {valorDiario.toFixed(2)} × {totalDias} dias)
                </span>
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
                <span className="text-base font-bold text-gray-900">
                  Total do Pedido:
                </span>
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
