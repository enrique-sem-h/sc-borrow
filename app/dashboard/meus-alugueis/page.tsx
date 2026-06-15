"use client";
import { Spinner } from "@/components/ui/spinner";
import { useGetAlugueis } from "@/modules/react-query/queries/aluguel-queries";
import { Aluguel } from "@/server/types";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type MeusAlugueisPageProps = {
  className?: string;
  children: ReactNode;
};

const StatusBadge = ({
  status,
  onAvaliar,
}: {
  status: Aluguel["status"];
  onAvaliar?: () => void;
}) => {
  if (status === "CANCELLED") {
    return (
      <span className="flex items-center gap-1.5 text-red-600 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        Cancelado
      </span>
    );
  }
  if (status === "WAITING_FOR_DISPATCH") {
    return (
      <span className="flex items-center gap-1.5 text-green-600 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        Esperando entrega
      </span>
    );
  }
  if (status === "WAITING_FOR_DELIVERY") {
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
        Em rota
      </span>
    );
  }
  if (status === "ITEM_IN_HAND") {
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
        Objeto em mãos
      </span>
    );
  }
  if (status === "COMPLETED") {
    return (
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
          Concluído
        </span>
        <button
          onClick={onAvaliar}
          className="px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-300 transition"
        >
          Avaliar
        </button>
      </div>
    );
  }
};

const MeusAlugueisPage: React.FC<MeusAlugueisPageProps> = ({
  className,
  children,
}) => {
  const router = useRouter();
  const alugueisQuery = useGetAlugueis("locatario");
  const alugueis = alugueisQuery.data?.data;
  const loading = alugueisQuery.isLoading;

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-serif font-bold text-gray-900">
          Meus aluguéis
        </h1>
        <button
          onClick={() => router.push("/meusalugueis/historico")}
          className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition"
        >
          Histórico
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center">
          <Spinner className="size-4" />
        </div>
      )}

      {!loading && (
        <>
          {!alugueis?.length ? (
            <div className="bg-white p-8 rounded-[28px] border text-center text-gray-400">
              Você não possui nenhum aluguel no momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {alugueis?.map((aluguel) => (
                <div
                  key={aluguel.id}
                  className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-100"
                >
                  <div className="bg-[#e9ecef] rounded-2xl h-48 mb-4 relative overflow-hidden flex items-center justify-center">
                    {aluguel.anuncio.fotos.find((foto) => foto.principal) ? (
                      <img
                        src={
                          aluguel.anuncio.fotos.find((foto) => foto.principal)
                            .url
                        }
                        alt={aluguel.titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-xs font-medium">
                        Sem imagem
                      </div>
                    )}
                    {aluguel.notificacoes && aluguel.notificacoes > 0 ? (
                      <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                        {aluguel.notificacoes}
                      </span>
                    ) : null}
                  </div>

                  <div className="px-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl">
                          {aluguel.anuncio.titulo}
                        </h3>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {new Date(aluguel.dataInicio).toLocaleDateString()} -{" "}
                          {new Date(aluguel.dataFim).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900 text-lg">
                        R$ {aluguel.valorTotal.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                    <div className="flex justify-end mt-2">
                      <StatusBadge
                        status={aluguel.status}
                        onAvaliar={() => setAluguelParaAvaliar(aluguel)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MeusAlugueisPage;
