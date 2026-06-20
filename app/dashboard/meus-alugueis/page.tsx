"use client";
import { Spinner } from "@/components/ui/spinner";
import { useGetAlugueis } from "@/modules/react-query/queries/aluguel-queries";
import { AluguelTipo } from "@/server/controllers/aluguel-controller";
import { Aluguel } from "@/server/types";
import { MessageCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
import { AvaliarModal } from "@/components/ui/rate-modal";
import { VisualizarAvaliarModal } from "@/components/ui/view-rate";
import StatusBadge from "@/components/ui/status-badge";
import apiService from "@/services/api";

type MeusAlugueisPageProps = {
  className?: string;
  children: ReactNode;
};

const MeusAlugueisPage: React.FC<MeusAlugueisPageProps> = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tipo = searchParams?.get("tipo") || "locatario";

  const alugueisQuery = useGetAlugueis(tipo);
  const alugueis = alugueisQuery.data?.data;
  const loading = alugueisQuery.isLoading;

  const [aluguelParaAvaliar, setAluguelParaAvaliar] =
    useState<Aluguel | null>(null);
  const [avaliacaoVisualizada, setAvaliacaoVisualizada] =
    useState<any | null>(null);
  const [aluguelVisualizado, setAluguelVisualizado] =
    useState<Aluguel | null>(null);

  const getChecklistPath = (aluguelId: string) => `/aluguel/${aluguelId}`;

  const changeTipo = (tipo: AluguelTipo) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("tipo", tipo);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleAvaliar = async (aluguel: Aluguel) => {
    const idUsuario =
      tipo === "locatario" ? aluguel.idLocatario : aluguel.idLocador;

    const response = await apiService.avaliacoes.getByAluguel(
      aluguel.id,
      idUsuario,
    );

    if (response.data) {
      setAvaliacaoVisualizada(response.data);
      setAluguelVisualizado(aluguel);
      return;
    }

    setAluguelParaAvaliar(aluguel);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <div className="flex gap-6 items-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900">
            Meus aluguéis
          </h1>

          <div className="flex bg-gray-100 rounded-full p-1 gap-1">
            <button
              onClick={() => changeTipo("locatario")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                tipo === "locatario"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Como locatário
            </button>
            <button
              onClick={() => changeTipo("locador")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                tipo === "locador"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Como locador
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center">
          <Spinner className="size-4" />
        </div>
      )}

      {!loading && (
        <>
          {!alugueis?.filter((a) => a.anuncio).length ? (
            <div className="bg-white p-8 rounded-[28px] border text-center text-gray-400">
              Você não possui nenhum aluguel no momento.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {alugueis
                .filter((a) => a.anuncio)
                .map((aluguel, index) => (
                  <div
                    key={index}
                    onClick={() => router.push(getChecklistPath(aluguel.id))}
                    className="flex flex-row shadow-sm border border-gray-100 rounded-2xl p-4 bg-white justify-between cursor-pointer hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        className="rounded-xl w-[100px] h-[100px] object-cover bg-gray-100 shrink-0"
                        src={
                          aluguel.anuncio?.fotos?.find((foto) => foto.principal)
                            ?.url || ""
                        }
                      />
                      <div className="flex flex-col gap-1 text-left">
                        <h2 className="font-bold text-gray-900">
                          {aluguel.anuncio?.titulo}
                        </h2>
                        <span className="text-sm text-gray-500">
                          R${" "}
                          {aluguel.anuncio?.valorDiario
                            .toFixed(2)
                            .replace(".", ",")}
                          /dia &mdash; Total R$
                          {aluguel.valorTotal.toFixed(2).replace(".", ",")}
                        </span>
                        <div className="mt-1">
                          <StatusBadge
                            status={aluguel.status}
                            onAvaliar={() => handleAvaliar(aluguel)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {tipo === "locador" && (
                          <span>Locatário: {aluguel.locatario?.nome}</span>
                        )}
                        {tipo === "locatario" && (
                          <span>Locador: {aluguel.locador?.nome}</span>
                        )}
                        <span className="text-yellow-500 font-semibold">
                          5.0 ★
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/chat?aluguelId=${aluguel.id}`);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold transition"
                      >
                        <MessageCircle size={14} />
                        Chat
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      <AvaliarModal
        isOpen={!!aluguelParaAvaliar}
        onClose={() => setAluguelParaAvaliar(null)}
        itemNome={aluguelParaAvaliar?.anuncio?.titulo ?? ""}
        periodoLocacao={
          aluguelParaAvaliar
            ? `${new Date(aluguelParaAvaliar.dataInicio).toLocaleDateString("pt-BR")} - ${new Date(aluguelParaAvaliar.dataFim).toLocaleDateString("pt-BR")}`
            : ""
        }
        idAluguel={aluguelParaAvaliar?.id ?? ""}
      />

      <VisualizarAvaliarModal
        isOpen={!!avaliacaoVisualizada}
        onClose={() => {
          setAvaliacaoVisualizada(null);
          setAluguelVisualizado(null);
        }}
        itemNome={aluguelVisualizado?.anuncio?.titulo ?? ""}
        periodoLocacao={
          aluguelVisualizado
            ? `${new Date(aluguelVisualizado.dataInicio).toLocaleDateString("pt-BR")} - ${new Date(aluguelVisualizado.dataFim).toLocaleDateString("pt-BR")}`
            : ""
        }
        nota={avaliacaoVisualizada?.nota ?? 0}
        comentario={avaliacaoVisualizada?.mensagem ?? ""}
      />
    </>
  );
};

export default MeusAlugueisPage;