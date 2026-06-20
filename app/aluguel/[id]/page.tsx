"use client";

import { Suspense, useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ConfirmedOrderModal } from "@/components/ui/confirmed-order";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useChangeAluguelStatus } from "@/modules/react-query/mutations/alugueis-mutations";
import { toast } from "react-toastify";
import { useGetAluguel } from "@/modules/react-query/queries/aluguel-queries";
import { Aluguel } from "@/server/types";
import { aluguelStatusArr } from "@/infra/database/schemas/alugueisSchema";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import StatusBadge from "@/components/ui/status-badge";

function AndamentoAluguelContent() {
  const router = useRouter();
  const params = useParams()!;
  const id = params.id;
  const { user } = useAuth()!;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const aluguelQuery = useGetAluguel(id);
  const loading = aluguelQuery.isLoading;
  const aluguel = aluguelQuery.data?.data;
  const mutation = useChangeAluguelStatus();
  const loadingMutation = mutation.isPending;
  const isLocador = aluguel?.locador.id === user?.id;

  const handleDispatch = async () => {
    const currentIndex = aluguelStatusArr.indexOf(aluguel!.status);
    const nextStatus = aluguelStatusArr.at(currentIndex + 1);

    try {
      await mutation.mutateAsync({
        id,
        status: nextStatus,
      });
      toast("Sucesso", {
        type: "success",
      });
    } catch (error) {
      console.log(error.response);

      toast(error.response.data.error, {
        type: "error",
      });
    }
    return;
    if (!aluguel) return;
    setDispatching(true);
    const token = localStorage.getItem("token") ?? "";
    try {
      const res = await fetch(`/api/aluguel/${aluguel.id}/dispatch`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAluguel((prev) =>
          prev ? { ...prev, status: "WAITING_FOR_DELIVERY" } : prev,
        );
        setIsModalOpen(true);
      }
    } finally {
      setDispatching(false);
    }
  };

  function timelineSteps(status: Aluguel["status"], locatarioNome: string) {
    const enumToArr = aluguelStatusArr;
    const idx = status === "CANCELLED" ? -1 : enumToArr.indexOf(status);

    if (isLocador) {
      return [
        {
          label: "Pedido recebido",
          done: idx >= enumToArr.indexOf("WAITING_FOR_CONFIRM"),
        },
        {
          label: "Pedido confirmado",
          done: idx >= enumToArr.indexOf("WAITING_FOR_DISPATCH"),
        },
        {
          label: "Envio confirmado",
          done: idx >= enumToArr.indexOf("WAITING_FOR_DELIVERY"),
        },
        {
          label: `Item com o locatário`,
          done: idx >= enumToArr.indexOf("ITEM_IN_HAND"),
        },
        {
          label: "Envio confirmado pelo locatário",
          done: idx >= enumToArr.indexOf("WAITING_FOR_RETURN_CONFIRM"),
        },
        {
          label: "Aluguel concluído",
          done: idx >= enumToArr.indexOf("COMPLETED"),
        },
      ];
    } else {
      return [
        {
          label: "Pedido realizado com sucesso",
          done: idx >= enumToArr.indexOf("WAITING_FOR_CONFIRM"),
        },
        {
          label: "Pedido confirmado pelo locador",
          done: idx >= enumToArr.indexOf("WAITING_FOR_DISPATCH"),
        },
        {
          label: "Envio confirmado pelo locador",
          done: idx >= enumToArr.indexOf("WAITING_FOR_DELIVERY"),
        },
        {
          label: "Item recebido",
          done: idx >= enumToArr.indexOf("ITEM_IN_HAND"),
        },
        {
          label: "Aguardando confirmação de chegada do item",
          done: idx >= enumToArr.indexOf("WAITING_FOR_RETURN_CONFIRM"),
        },
        {
          label: "Aluguel concluído",
          done: idx >= enumToArr.indexOf("COMPLETED"),
        },
      ];
    }
  }

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
  const taxaServico = subtotal * 0.12;
  const caucao = aluguel.anuncio.caucao;

  const steps = timelineSteps(aluguel.status!, aluguel.locatario?.nome ?? "");

  const podeDespachar = aluguel.status === "WAITING_FOR_DISPATCH";

  function messageFromStatus(status: Aluguel["status"]) {
    switch (status) {
      case "WAITING_FOR_PAYMANT":
        return "Aguardando pagamento";
        break;
      case "WAITING_FOR_CONFIRM":
        return "Aguardando confirmação";
        break;
      case "WAITING_FOR_DISPATCH":
        return "Agurandando despache";
        break;
      case "WAITING_FOR_DELIVERY":
        return "Aguardando entrega";
        break;
      case "ITEM_IN_HAND":
        return "Agurdando devolução";
        break;
      case "WAITING_FOR_RETURN_CONFIRM":
        return "Aguardando confirmação de devolução";
        break;
      case "COMPLETED":
        return "Concluído";
        break;
      case "CANCELLED":
        return "Cancelado";
        break;
    }
  }

  function buttonMessageFromStatus(status: Aluguel["status"]) {
    switch (status) {
      case "WAITING_FOR_CONFIRM":
        return "Confirmar pedido";
      case "WAITING_FOR_DISPATCH":
        return "Confirmar despache";
      case "WAITING_FOR_DELIVERY":
        return "Confirmar chegada do produto";
      case "ITEM_IN_HAND":
        return "Confirmar despache";
      case "WAITING_FOR_RETURN_CONFIRM":
        return "Confirmar devolução";
      default:
        return "Errado";
    }
  }

  function renderButton() {
    const currentIndex = aluguelStatusArr.indexOf(aluguel!.status);
    const currentStatus = aluguel!.status;
    console.log(currentStatus, "currentStatus");

    const visibleForLocador: Aluguel["status"][] = [
      "WAITING_FOR_CONFIRM",
      "WAITING_FOR_DISPATCH",
      "WAITING_FOR_RETURN_CONFIRM",
    ];

    const visibleForLocatario: Aluguel["status"][] = [
      "WAITING_FOR_DELIVERY",
      "ITEM_IN_HAND",
    ];

    const isVisible = isLocador
      ? visibleForLocador.includes(currentStatus)
      : visibleForLocatario.includes(currentStatus);

    if (!isVisible) {
      return null;
    }
    const message = buttonMessageFromStatus(currentStatus);
    return (
      <button
        type="button"
        onClick={handleDispatch}
        disabled={loadingMutation}
        className={`px-6 py-2 text-white text-sm font-bold rounded-full shadow-md transition cursor-pointer ${
          true
            ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {loadingMutation ? <Spinner className="size-3" /> : message}
      </button>
    );
  }

  async function handleCancel() {
    try {
      await mutation.mutateAsync({
        id,
        status: "CANCELLED",
      });
    } catch (error) {
      toast("Erro ao cancelar", {
        type: "error",
      });
    }
  }
  console.log(aluguel);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
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
                {aluguel.locatario && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Locatário: {aluguel.locatario.nome}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">
                  R$ {valorDiario.toFixed(2).replace(".", ",")}
                </span>
                <StatusBadge status={aluguel.status} />
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
                <span>
                  R$ {aluguel.valorTotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            <div className="flex justify-center mt-8">{renderButton()}</div>
            {!["CANCELLED", "COMPLETED"].includes(aluguel.status) && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleCancel}
                  disabled={loadingMutation}
                  className="px-6 py-2 bg-[#f0655d] hover:bg-red-600 text-white text-sm font-bold rounded-full shadow-md shadow-red-100 transition disabled:opacity-60"
                >
                  {loadingMutation ? (
                    <Spinner className="size-3" />
                  ) : (
                    "Cancelar pedido"
                  )}
                </button>
              </div>
            )}
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
              router.push(`/checklist/enviar-locatario?aluguelId=${aluguel.id}`)
            }
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-serif font-semibold rounded-xl text-base transition shadow-sm"
          >
            Checklist de entrega
          </button>
          <button
            onClick={() =>
              router.push(
                `/checklist/confirma-devolucao?aluguelId=${aluguel.id}`,
              )
            }
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-serif font-semibold rounded-xl text-base transition shadow-sm"
          >
            Checklist de devolução
          </button>
        </div>
      </div>

      <ConfirmedOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function AndamentoLocadorPage() {
  return (
    <Suspense>
      <AndamentoAluguelContent />
    </Suspense>
  );
}
