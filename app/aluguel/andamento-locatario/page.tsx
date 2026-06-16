"use client";

import { Suspense, useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type AluguelDetalhe = {
  id: string;
  status: string;
  dataInicio: string;
  dataFim: string;
  valorTotal: number;
  locador: { nome: string } | null;
  anuncio: {
    titulo: string;
    valorDiario: number;
    fotos: { url: string; principal: boolean }[];
  } | null;
};

const STATUS_ORDER = [
  "WAITING_FOR_PAYMANT",
  "WAITING_FOR_DISPATCH",
  "WAITING_FOR_DELIVERY",
  "ITEM_IN_HAND",
  "COMPLETED",
];

function timelineSteps(status: string) {
  const idx = STATUS_ORDER.indexOf(status);
  return [
    {
      label: "Pedido realizado com sucesso",
      done: idx >= STATUS_ORDER.indexOf("WAITING_FOR_DISPATCH"),
    },
    {
      label: "Envio confirmado pelo locador",
      done: idx >= STATUS_ORDER.indexOf("WAITING_FOR_DELIVERY"),
    },
    {
      label: "Item recebido",
      done: idx >= STATUS_ORDER.indexOf("ITEM_IN_HAND"),
    },
    {
      label: "Aluguel concluído",
      done: idx >= STATUS_ORDER.indexOf("COMPLETED"),
    },
  ];
}

function AndamentoLocatarioContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params?.get("id") ?? "";

  const [aluguel, setAluguel] = useState<AluguelDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token") ?? "";
    fetch(`/api/aluguel/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setAluguel(d.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!aluguel || !confirm("Tem certeza que deseja cancelar este aluguel?"))
      return;
    setCancelling(true);
    const token = localStorage.getItem("token") ?? "";
    try {
      const res = await fetch(`/api/aluguel/${aluguel.id}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAluguel((prev) =>
          prev ? { ...prev, status: "CANCELLED" } : prev,
        );
      }
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Carregando...
      </div>
    );
  }

  if (!aluguel) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Aluguel não encontrado.
      </div>
    );
  }

  const foto =
    aluguel.anuncio?.fotos?.find((f) => f.principal)?.url ||
    aluguel.anuncio?.fotos?.[0]?.url ||
    "";

  const inicio = aluguel.dataInicio
    ? format(new Date(aluguel.dataInicio), "dd MMM", { locale: ptBR })
    : "";
  const fim = aluguel.dataFim
    ? format(new Date(aluguel.dataFim), "dd MMM", { locale: ptBR })
    : "";

  const dias =
    aluguel.dataInicio && aluguel.dataFim
      ? Math.max(
          1,
          Math.ceil(
            (new Date(aluguel.dataFim).getTime() -
              new Date(aluguel.dataInicio).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 1;

  const valorDiario = aluguel.anuncio?.valorDiario ?? 0;
  const subtotal = valorDiario * dias;
  const taxaServico = 12;
  const caucao = aluguel.valorTotal - subtotal - taxaServico;

  const steps = timelineSteps(aluguel.status);
  const cancelado = aluguel.status === "CANCELLED";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="w-full max-w-5xl mx-auto bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-12 transition-all">

        <div className="flex justify-start mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-black transition p-2 rounded-full hover:bg-gray-50 flex items-center justify-center"
          >
            <ChevronLeft size={32} strokeWidth={2} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 border border-gray-200/80 rounded-2xl p-4 bg-white flex flex-col gap-4 shadow-sm">
            <div className="w-full aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
              {foto ? (
                <img
                  src={foto}
                  alt={aluguel.anuncio?.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-300 text-sm">Sem imagem</div>
              )}
            </div>
            <div className="flex justify-between items-end px-1">
              <div>
                <h3 className="font-serif font-bold text-xl text-gray-900 leading-tight">
                  {aluguel.anuncio?.titulo ?? "Anúncio removido"}
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  {inicio} — {fim}
                </p>
                {aluguel.locador && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Locador: {aluguel.locador.nome}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">
                  R$ {valorDiario.toFixed(2).replace(".", ",")}
                </span>
                <span
                  className={`block text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1 text-center border ${
                    cancelado
                      ? "text-red-500 bg-red-50 border-red-100"
                      : "text-green-500 bg-green-50 border-green-100"
                  }`}
                >
                  ● {cancelado ? "Cancelado" : "Ativo"}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 border border-gray-200/80 rounded-2xl p-6 bg-white shadow-sm h-full flex flex-col justify-between">
            <div className="space-y-3 font-medium text-gray-600 text-base">
              <div className="flex justify-between">
                <span className="text-gray-400">Valor:</span>
                <span className="text-gray-400">
                  R$ {valorDiario.toFixed(2)} × {dias} dias
                </span>
                <span className="text-gray-800 font-semibold">
                  R$ {subtotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Caução</span>
                <span className="text-gray-800 font-semibold">
                  R$ {caucao.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Taxa de serviço</span>
                <span className="text-gray-800 font-semibold">
                  R$ {taxaServico.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-px bg-gray-100 my-4" />
              <div className="flex justify-between text-lg font-bold text-gray-900 font-serif">
                <span>Total</span>
                <span>R$ {aluguel.valorTotal.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              {!cancelado && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-6 py-2 bg-[#f0655d] hover:bg-red-600 text-white text-sm font-bold rounded-full shadow-md shadow-red-100 transition disabled:opacity-60"
                >
                  {cancelling ? "Cancelando..." : "Cancelar pedido"}
                </button>
              )}
              {cancelado && (
                <span className="text-red-500 font-semibold text-sm">
                  Este aluguel foi cancelado.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-3xl mx-auto border-t border-gray-100 pt-8">
          <h4 className="text-xl font-serif font-bold text-gray-900 mb-6 px-1">
            Status atual
          </h4>
          <div className="relative pl-8 space-y-6">
            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-200" />
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 relative">
                <div
                  className={`absolute -left-7 top-1.5 w-3.5 h-3.5 rounded-full z-10 border-2 transition-all ${
                    step.done
                      ? "border-black bg-black scale-110"
                      : "border-gray-400 bg-white"
                  }`}
                />
                <p
                  className={`text-base font-medium ${step.done ? "text-gray-900 font-semibold" : "text-gray-400"}`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-gray-200 my-8 max-w-3xl mx-auto" />

        <div className="flex justify-center items-center gap-3 max-w-xl mx-auto">
          <button
            onClick={() =>
              router.push(
                `/checklist/confirma-entrega?aluguelId=${aluguel.id}`,
              )
            }
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-serif font-semibold rounded-xl text-base transition shadow-sm"
          >
            Checklist de entrega
          </button>
          <button
            onClick={() =>
              router.push(
                `/checklist/devolucao-locador?aluguelId=${aluguel.id}`,
              )
            }
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-serif font-semibold rounded-xl text-base transition shadow-sm"
          >
            Checklist de devolução
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AndamentoLocatarioPage() {
  return (
    <Suspense>
      <AndamentoLocatarioContent />
    </Suspense>
  );
}
