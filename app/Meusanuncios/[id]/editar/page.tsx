"use client";
import AnunciarForm from "@/components/forms/anunciar-form";
import { useEditAnuncio } from "@/modules/react-query/mutations/anuncios-mutations";
import { useGetAnuncio } from "@/modules/react-query/queries/anuncios-queries";
import { insertAnuncioSchema } from "@/modules/zod/schemas/anunciosSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Check } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

const schema = insertAnuncioSchema.extend({
  fotos: z.array(z.any()).min(3),
});

type FormType = z.infer<typeof schema>;

export default function EditarAnuncioPage() {
  const router = useRouter();
  const params = useParams();
  const idAnuncio = params?.id as string;

  const [showModal, setShowModal] = useState(false);
  const getAnuncioQuery = useGetAnuncio(idAnuncio);
  const editAnuncioMutation = useEditAnuncio();

  const titulo = getAnuncioQuery.data?.data?.titulo;

  const loadingAnuncio = getAnuncioQuery.isLoading;
  const loading = editAnuncioMutation.isPending;

  useEffect(() => {
    if (!idAnuncio) return;
  }, [idAnuncio, router]);

  const formHook = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      fotos: [],
    },
  });

  const { reset } = formHook;

  const onFormSubmit: SubmitHandler<FormType> = async (data: FormType) => {
    if (!idAnuncio) return;

    try {
      await editAnuncioMutation.mutateAsync({ id: idAnuncio, data } as any);
      setShowModal(true);
    } catch (error) {
      toast("Erro ao salvar anúncio", { type: "error" });
    }
  };

  useEffect(() => {
    if (getAnuncioQuery.isFetching) return;
    if (!getAnuncioQuery.data?.data) return;

    const { fotos, ...others } = getAnuncioQuery.data.data;
    reset({ ...others, fotos });
  }, [getAnuncioQuery.isFetching]);

  if (loadingAnuncio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 font-medium animate-pulse">
          Buscando informações do anúncio...
        </p>
      </div>
    );
  }

  return (
    <main className="h-screen w-full bg-white flex flex-col overflow-hidden font-sans text-[#1a1a1a]">
      <header className="px-12 py-6 flex items-center gap-6 shrink-0">
        <button
          onClick={() => router.back()}
          className="hover:bg-gray-100 p-2 rounded-full transition-all"
        >
          <ChevronLeft size={32} strokeWidth={2.5} className="text-gray-800" />
        </button>

        <h2 className="text-4xl font-serif font-bold tracking-tight">
          Editar anúncio:{" "}
          <span className="font-serif font-bold text-gray-600">{titulo}</span>
        </h2>
      </header>

      <AnunciarForm
        formHook={formHook}
        onSubmit={onFormSubmit}
        loading={loading}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-[36px] p-10 shadow-2xl border border-gray-100">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check size={38} className="text-green-600" strokeWidth={3} />
            </div>

            <h3 className="text-3xl font-serif font-bold text-center text-gray-900 mb-3">
              Anúncio alterado!
            </h3>

            <p className="text-center text-gray-500 leading-relaxed mb-8">
              Suas modificações foram salvas no banco de dados com sucesso.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
              >
                Fechar
              </button>

              <button
                onClick={() => router.push("/Meusanuncios")}
                className="flex-1 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm font-medium shadow-md shadow-blue-200"
              >
                Ir para Meus anúncios
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </main>
  );
}
