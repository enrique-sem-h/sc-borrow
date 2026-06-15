"use client";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteAnuncio } from "@/modules/react-query/mutations/anuncios-mutations";
import { useGetAnuncios } from "@/modules/react-query/queries/anuncios-queries";
import { Edit3, Trash2 } from "lucide-react";
import router from "next/router";
import { ReactNode } from "react";

type DashboardMeusAnunciosPageProps = {
  className?: string;
  children: ReactNode;
};

const DashboardMeusAnunciosPage: React.FC<DashboardMeusAnunciosPageProps> = ({
  className,
  children,
}) => {
  const anunciosQuery = useGetAnuncios();
  const anuncioDeleteMutation = useDeleteAnuncio();
  const anuncios = anunciosQuery.data?.data.anuncios || [];

  console.log(anuncios);

  const loading = anunciosQuery.isLoading;

  return (
    <>
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-10">
        Meus anúncios ativos
      </h1>

      {anuncios?.length === 0 ? (
        <div className="bg-white p-8 rounded-[28px] border text-center text-gray-400">
          Você não possui nenhum anúncio ativo no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          {loading && <Spinner className="size-4" />}
          {!loading &&
            !!anuncios &&
            anuncios.map((anuncio) => {
              const mainImage = anuncio.fotos.find((foto) => foto.principal);
              return (
                <div
                  key={anuncio.id}
                  onClick={() => router.push("/aluguel/andamento-locador")}
                  className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-100 relative group cursor-pointer hover:shadow-md transition-all duration-200"
                >
                  <div className="bg-[#e9ecef] rounded-2xl h-48 mb-4 relative overflow-hidden flex items-center justify-center">
                    {mainImage ? (
                      <img
                        src={mainImage.url}
                        alt={anuncio.titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-xs font-medium">
                        Sem imagem
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                      <button
                        onClick={(e) => handleGoToEdit(anuncio.id, e)}
                        className="bg-white/95 p-1.5 rounded-lg shadow-sm hover:bg-white text-gray-600 transition"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={(e) => handleOpenDeleteModal(anuncio, e)}
                        className="bg-white/95 p-1.5 rounded-lg shadow-sm hover:bg-white text-gray-600 transition hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="px-1">
                    <h3 className="text-[13px] font-bold text-gray-700 uppercase tracking-tight">
                      {anuncio.titulo}
                    </h3>
                    <div className="flex justify-between items-end mt-1">
                      <p className="font-extrabold text-lg text-gray-900">
                        R$ {anuncio.valorDiario.toFixed(2).replace(".", ",")}{" "}
                        /dia
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

export default DashboardMeusAnunciosPage;
