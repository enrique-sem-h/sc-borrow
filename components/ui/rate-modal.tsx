"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/services/api";

const avaliacaoSchema = z.object({
  nota: z.number().min(1, { message: "Selecione pelo menos 1 estrela" }).max(5),
  comentario: z
    .string()
    .min(5, { message: "O comentário deve ter pelo menos 5 caracteres" }),
});

type AvaliacaoFormValues = z.infer<typeof avaliacaoSchema>;

interface AvaliarModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemNome: string;
  periodoLocacao: string;
  idAluguel: string;
}

export function AvaliarModal({
  isOpen,
  onClose,
  itemNome,
  periodoLocacao,
  idAluguel,
}: AvaliarModalProps) {
  const [sucesso, setSucesso] = useState(false);
  const { user } = useAuth();
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AvaliacaoFormValues>({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: {
      nota: 0,
      comentario: "",
    },
  });

  const notaAtual = watch("nota");

  if (!isOpen) return null;

  const onSubmit = async (data: AvaliacaoFormValues) => {
    if (!user?.id || !idAluguel) {
      return;
    }

    try {
      await apiService.avaliacoes.create({
        nota: data.nota,
        mensagem: data.comentario,
        idUsuario: user.id,
        idAluguel,
      });

      setSucesso(true);
    } catch (error) {
      console.error(error);
      alert("Não foi possível enviar a avaliação.");
    }
  };

  if (sucesso) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl relative border border-gray-100 text-center">
          <button
            onClick={() => {
              setSucesso(false);
              onClose();
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-black transition"
          >
            <X size={20} />
          </button>
          <h1 className="text-2xl font-['Shrikhand'] tracking-tight mb-4">
            BORROW
          </h1>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Obrigado!
          </h2>
          <p className="text-gray-500 font-medium">
            Sua avaliação foi enviada com sucesso
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-white rounded-[28px] p-8 shadow-2xl relative border border-gray-100">
        <h1 className="text-center text-2xl font-['Shrikhand'] tracking-tight mb-2">
          BORROW
        </h1>
        <div className="border-b border-gray-100 mb-4" />

        <h2 className="text-xl font-serif font-bold text-center text-gray-900 mb-1">
          Avaliação
        </h2>
        <p className="text-center text-xs text-gray-400 font-medium mb-6">
          <span className="font-bold text-gray-700">{itemNome}</span> (Locação
          de {periodoLocacao})
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col items-center">
            <Controller
              name="nota"
              control={control}
              render={() => (
                <div className="flex gap-2 bg-gray-50 px-6 py-3 rounded-full border border-gray-100/70">
                  {[1, 2, 3, 4, 5].map((estrela) => (
                    <button
                      key={estrela}
                      type="button"
                      onClick={() =>
                        setValue("nota", estrela, { shouldValidate: true })
                      }
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={
                          estrela <= notaAtual
                            ? "fill-gray-900 text-gray-900"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.nota && (
              <p className="text-red-500 text-xs mt-1">{errors.nota.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-800 mb-1.5 ml-1">
              Comentário:
            </label>
            <Controller
              name="comentario"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Escreva como foi sua experiência..."
                  className="w-full border-2 border-gray-200 rounded-2xl p-3 h-24 resize-none outline-none focus:border-blue-500 transition-all text-sm"
                />
              )}
            />
            {errors.comentario && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.comentario.message}
              </p>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-serif font-bold rounded-xl transition-all shadow-md shadow-blue-100"
            >
              Enviar avaliação
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition underline pt-1 block"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

