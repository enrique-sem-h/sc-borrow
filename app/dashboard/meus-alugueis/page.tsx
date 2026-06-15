"use client";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useGetAlugueis } from "@/modules/react-query/queries/aluguel-queries";
import { AluguelTipo } from "@/server/controllers/aluguel-controller";
import { Aluguel } from "@/server/types";
import { Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

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
  const [tipo, setTipo] = useState<AluguelTipo>("locatario");
  const alugueisQuery = useGetAlugueis(tipo);
  const alugueis = alugueisQuery.data?.data;
  const loading = alugueisQuery.isLoading;

  const onTipoChange = (value: string) => {
    setTipo(value as AluguelTipo);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <div className="flex gap-4 items-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900">
            Meus aluguéis
          </h1>

          <ToggleGroup
            variant="outline"
            type="single"
            value={tipo}
            onValueChange={onTipoChange}
            defaultValue="locador"
          >
            <ToggleGroupItem value="locador">Como locador</ToggleGroupItem>
            <ToggleGroupItem value="locatario">Como locatário</ToggleGroupItem>
          </ToggleGroup>
        </div>
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
            <div className="flex flex-col gap-3">
              {alugueis.map((aluguel, index) => {
                return (
                  <Link
                    key={index}
                    href={`/dashboard/meus-alugueis/${aluguel.id}`}
                  >
                    <div className="flex  flex-row   shadow-sm border border-gray-100 rounded-2xl p-4 bg-white justify-between">
                      <div className="flex gap-2 items-center object-cover">
                        <img
                          className="rounded w-[128px] h-[128px]"
                          src={
                            aluguel.anuncio.fotos.find((foto) => foto.principal)
                              ?.url || null
                          }
                        />
                        <div>
                          <div className="flex flex-col gap-1">
                            <h2 className="font-bold">
                              {aluguel.anuncio.titulo}
                            </h2>
                            <span className="font-bold">
                              R${" "}
                              {aluguel.anuncio.valorDiario
                                .toFixed(2)
                                .replace(".", ",")}
                              /dia - Total R$
                              {aluguel.valorTotal.toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center flex-col">
                        <div className="flex gap-2">
                          {tipo === "locador" && (
                            <span>Locatário: {aluguel.locatario.nome}</span>
                          )}
                          {tipo === "locatario" && (
                            <span>Locador: {aluguel.locador.nome}</span>
                          )}
                          <span>
                            5.0
                            <span className="ml-1 text-yellow-500">★</span>
                          </span>
                        </div>
                        <div>
                          <StatusBadge status={aluguel.status} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MeusAlugueisPage;
