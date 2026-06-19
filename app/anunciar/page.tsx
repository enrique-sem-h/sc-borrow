"use client";
import AnunciarForm from "@/components/forms/anunciar-form";
import { FieldError } from "@/components/ui/field";
import FormInput, {
  SelectFormInput,
  TextAreaFormInput,
} from "@/components/ui/form-input";
import { useAddAnuncio } from "@/modules/react-query/mutations/anuncios-mutations";
import { insertAnuncioSchema } from "@/modules/zod/schemas/anunciosSchemas";
import { CreateAnuncioDTO } from "@/server/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  UploadCloud,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

type FormType = CreateAnuncioDTO;

const schema = insertAnuncioSchema.extend({
  fotos: z.array(z.instanceof(File)).min(3, "Necessário pelo menos 3 fotos"),
});

export default function CriarAnuncioPage() {
  const router = useRouter();
  const addAnuncioMutation = useAddAnuncio();

  const formHook = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      fotos: [],
    },
  });
  const { watch } = formHook;

  const loading = addAnuncioMutation.isPending;
  const [showModal, setShowModal] = useState(false);

  const onFormSubmit: SubmitHandler<FormType> = async (data: FormType) => {
    try {
      const response = await addAnuncioMutation.mutateAsync(data);

      setShowModal(true);
    } catch (error) {
      toast("Ocorreu um erro ao tentar criar anúncio", {
        type: "error",
      });
    }
  };

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
          Criar anúncio
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
              Anúncio salvo!
            </h3>

            <p className="text-center text-gray-500 leading-relaxed mb-8">
              Seu anúncio foi publicado com sucesso.
            </p>

            <div className="flex gap-4">
              <button
                className="flex-1 py-3 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                onClick={() => setShowModal(false)}
              >
                Fechar
              </button>

              <button
                onClick={() => router.push("/Meusanuncios")}
                className="flex-1 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all font-medium"
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
