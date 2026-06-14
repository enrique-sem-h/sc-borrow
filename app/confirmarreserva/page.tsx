"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronLeft, Image as ImageIcon } from "lucide-react";
import { Suspense } from "react";

const reservaSchema = z.object({
  dataInicio: z.string().min(1, { message: "Data de início obrigatória" }),
  dataFim:    z.string().min(1, { message: "Data de fim obrigatória" }),
});

type ReservaFormValues = z.infer<typeof reservaSchema>;

function ConfirmarReservaContent() {
  const router = useRouter();
  const params = useSearchParams();

  if (!params) return null;

  const idAnuncio   = params.get("idAnuncio") ?? "";
  const idLocatario = params.get("idLocatario") ?? "";
  const titulo      = params.get("titulo") ?? "";
  const foto        = params.get("foto") ?? null;
  const dataInicio  = params.get("dataInicio") ?? "";
  const dataFim     = params.get("dataFim") ?? "";
  const valorDiario = parseFloat(params.get("valorDiario") ?? "0");
  const caucao      = parseFloat(params.get("caucao") ?? "0");
  const totalDias   = parseInt(params.get("totalDias") ?? "0");
  const taxaServico = 12.00;
  const valorAluguel = valorDiario * totalDias;
  const valorTotal   = valorAluguel + caucao + taxaServico;

  const { handleSubmit, control, formState: { errors } } = useForm<ReservaFormValues>({
    resolver: zodResolver(reservaSchema),
    defaultValues: { dataInicio, dataFim },
  });

  const onConfirmar = async (data: ReservaFormValues) => {
    await fetch("/confirmarreserva/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idAnuncio, idLocatario, titulo, ...data, valorTotal }),
    });
    const query = new URLSearchParams({
      idAnuncio,
      idLocatario,
      titulo,
      dataInicio:  data.dataInicio,
      dataFim:     data.dataFim,
      valorDiario: String(valorDiario),
      totalDias:   String(totalDias),
      caucao:      String(caucao),
    });
    router.push(`/pagamento?${query.toString()}`);
  };

  return (
    <main className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      <div className="max-w-4xl mx-auto px-8 py-10">

        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-600"
          >
            <ChevronLeft size={26} />
          </button>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Confirme sua reserva
          </h1>
        </div>

        <div className="border border-gray-200 rounded-[28px] overflow-hidden shadow-sm">

          <div className="flex items-center gap-6 p-6">
            <div className="w-24 h-24 bg-[#f8f9fa] rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
              {foto ? (
                <img src={foto} alt={titulo} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={36} strokeWidth={1} className="text-gray-300" />
              )}
            </div>
            <h2 className="text-xl font-serif font-bold text-gray-900 leading-snug">
              {titulo}
            </h2>
          </div>

          <div className="border-t border-gray-200" />

          <form onSubmit={handleSubmit(onConfirmar)}>
            <div className="flex flex-col md:flex-row">

              <div className="flex-1 p-6 space-y-4">
                <p className="text-sm font-bold text-gray-700">Datas:</p>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">De:</label>
                    <Controller
                      name="dataInicio"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="date"
                          {...field}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-gray-700"
                        />
                      )}
                    />
                    {errors.dataInicio && (
                      <p className="text-red-500 text-[11px] mt-1">{errors.dataInicio.message}</p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Até:</label>
                    <Controller
                      name="dataFim"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="date"
                          {...field}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-gray-700"
                        />
                      )}
                    />
                    {errors.dataFim && (
                      <p className="text-red-500 text-[11px] mt-1">{errors.dataFim.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden md:block w-px bg-gray-200 my-4" />

              <div className="flex-1 p-6 space-y-2">
                <p className="text-sm font-bold text-gray-700 mb-3">Valor:</p>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>R${valorDiario.toFixed(2)} x {totalDias} dias</span>
                  <span>R${valorAluguel.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Caução</span>
                  <span>R${caucao.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Taxa de serviço</span>
                  <span>R$ {taxaServico.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold text-gray-900">
                  <span>Total</span>
                  <span>R${valorTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200">
              <button
                type="submit"
                className="w-full py-4 bg-gray-200 hover:bg-blue-600 hover:text-white text-gray-800 font-serif text-lg font-bold transition-all"
              >
                Solicitar reserva
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmarReservaPage() {
  return (
    <Suspense>
      <ConfirmarReservaContent />
    </Suspense>
  );
}
