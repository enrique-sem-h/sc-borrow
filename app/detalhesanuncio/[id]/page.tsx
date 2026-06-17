"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CheckCircle,
  MapPin,
  ChevronLeft,
  Image as ImageIcon,
} from "lucide-react";

import { DayPicker, DateRange } from "react-day-picker";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

import "react-day-picker/dist/style.css";
import { useGetAnuncio } from "@/modules/react-query/queries/anuncios-queries";

const reservaSchema = z
  .object({
    dataInicio: z.string().min(1, { message: "Data de início obrigatória" }),
    dataFim: z.string().min(1, { message: "Data de fim obrigatória" }),
  })
  .refine(
    (data) => {
      if (!data.dataInicio || !data.dataFim) return true;
      return new Date(data.dataFim) >= new Date(data.dataInicio);
    },
    {
      message: "A data de fim deve ser igual ou posterior à data de início",
      path: ["dataFim"],
    },
  );

type ReservaFormValues = z.infer<typeof reservaSchema>;

interface AnuncioDetalhes {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  valorDiario: number;
  caucao: number;
  foto_principal: string | null;
}

const MOCK_ANUNCIO: AnuncioDetalhes = {
  id: "",
  titulo: "Furadeira de Impacto 1/2 Pol. 600W 220V Tramontina PRO-424100-F6",
  descricao:
    "Ideal para perfurações em concreto, alvenaria e madeira. Alta performance, empunhadura ergonômica, acompanha chave de mandril e manual técnico.",
  categoria: "Ferramentas",
  valorDiario: 35.0,
  caucao: 100.0,
  foto_principal: null,
};

export default function DetalhesAnuncioPage() {
  const router = useRouter();
  const params = useParams();
  const idAnuncio = String(params?.id ?? "");
  const { user } = useAuth();
  const anunciosQuery = useGetAnuncio(idAnuncio);
  const anuncio = anunciosQuery.data?.data;
  const loading = anunciosQuery.isLoading;
  const fotoPrincipal = anuncio?.fotos.find((foto) => foto.principal);

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReservaFormValues>({
    resolver: zodResolver(reservaSchema),
    defaultValues: { dataInicio: "", dataFim: "" },
  });

  if (loading) {
    return null;
  }

  if (!anuncio) {
    return router.back();
  }

  const dataInicioW = watch("dataInicio");
  const dataFimW = watch("dataFim");

  const datasBloqueadas =
    anuncio?.datasBloqueadas?.map((periodo) => ({
      from: parseISO(periodo.dataInicio.slice(0, 10)),
      to: parseISO(periodo.dataFim.slice(0, 10)),
    })) ?? [];

  const obterRangeDoForm = (): DateRange | undefined => {
    const inicio = dataInicioW ? parseISO(dataInicioW) : undefined;
    const fim = dataFimW ? parseISO(dataFimW) : undefined;
    if (inicio && isValid(inicio)) {
      return { from: inicio, to: fim && isValid(fim) ? fim : undefined };
    }
    return undefined;
  };

  const handleCalendarSelect = (newRange: DateRange | undefined) => {
    setValue(
      "dataInicio",
      newRange?.from ? format(newRange.from, "yyyy-MM-dd") : "",
      { shouldValidate: true },
    );
    setValue("dataFim", newRange?.to ? format(newRange.to, "yyyy-MM-dd") : "", {
      shouldValidate: true,
    });
  };

  let totalDias = 0;
  let valorAluguel = 0;
  const taxaServico = 12.0;
  let valorTotal = 0;

  if (dataInicioW && dataFimW) {
    const inicio = new Date(dataInicioW);
    const fim = new Date(dataFimW);
    const diffTime = fim.getTime() - inicio.getTime();
    if (diffTime >= 0) {
      totalDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      valorAluguel = anuncio.valorDiario * totalDias;
      valorTotal = valorAluguel + taxaServico;
    }
  }

  const onSolicitarReserva = (data: ReservaFormValues) => {
    const query = new URLSearchParams({
      idAnuncio: idAnuncio,
      idLocatario: user?.id ?? "",
      titulo: anuncio.titulo,
      foto: anuncio.foto_principal ?? "",
      dataInicio: data.dataInicio,
      dataFim: data.dataFim,
      valorDiario: String(anuncio.valorDiario),
      caucao: String(anuncio.caucao),
      totalDias: String(totalDias),
    });
    router.push(`/confirmarreserva?${query.toString()}`);
  };

  return (
    <main className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      <header className="px-12 py-4 border-b border-gray-100 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="hover:bg-gray-100 p-2 rounded-full transition-all"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <span className="text-sm font-medium text-gray-500">Voltar</span>
      </header>

      <div className="max-w-[1400px] mx-auto px-12 py-8 flex flex-col lg:flex-row gap-12 items-start">
        <section className="flex-1 space-y-6 w-full pt-4">
          <div className="w-full bg-[#f8f9fa] rounded-[32px] h-[450px] overflow-hidden border border-gray-100 flex items-center justify-center p-8 shadow-sm">
            {fotoPrincipal ? (
              <img
                src={fotoPrincipal.url}
                alt={anuncio?.titulo}
                className="max-h-full object-contain"
              />
            ) : (
              <div className="text-gray-300 flex flex-col items-center gap-2">
                <ImageIcon size={64} strokeWidth={1} />
                <span className="text-sm font-medium">Foto do Anúncio</span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 leading-tight">
              {anuncio.titulo}
            </h1>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              {anuncio.descricao}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-6" />

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-200 rounded-full flex-shrink-0" />
            <div>
              <h3 className="text-base font-bold flex items-center gap-1.5 text-gray-900">
                Proprietário
                <CheckCircle
                  size={16}
                  className="text-blue-500 fill-blue-500 text-white"
                />
              </h3>
              <p className="text-gray-400 text-xs flex items-center gap-1 mt-1 font-medium">
                <MapPin size={14} /> {anuncio.categoria}
              </p>
            </div>
          </div>
        </section>

        <aside className="w-full lg:w-[420px] bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl shadow-gray-100/70 shrink-0">
          <div className="mb-6">
            <span className="text-3xl font-serif font-extrabold text-gray-900">
              R$ {anuncio.valorDiario}
            </span>
            <span className="text-gray-400 text-base font-normal">/dia</span>
          </div>

          <form
            onSubmit={handleSubmit(onSolicitarReserva)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">
                  Início
                </label>
                <Controller
                  name="dataInicio"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="date"
                      {...field}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-gray-700"
                    />
                  )}
                />
                {errors.dataInicio && (
                  <p className="text-red-500 text-[11px] mt-1 ml-1">
                    {errors.dataInicio.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">
                  Fim
                </label>
                <Controller
                  name="dataFim"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="date"
                      {...field}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-gray-700"
                    />
                  )}
                />
                {errors.dataFim && (
                  <p className="text-red-500 text-[11px] mt-1 ml-1">
                    {errors.dataFim.message}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-[#f8f9fa] rounded-2xl p-2 flex justify-center border border-gray-50 custom-calendar">
              <DayPicker
                mode="range"
                selected={obterRangeDoForm()}
                onSelect={handleCalendarSelect}
                locale={ptBR}
                modifiersClassNames={{
                  selected: "bg-blue-600 text-white rounded-md",
                  range_start: "rounded-l-full bg-blue-600",
                  range_end: "rounded-r-full bg-blue-600",
                  range_middle: "bg-blue-50 text-blue-600",
                }}
              />
            </div>

            {totalDias > 0 && (
              <div className="space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>
                    R$ {anuncio.valorDiario.toFixed(2)} x {totalDias} dias
                  </span>
                  <span className="font-medium text-gray-800">
                    R$ {valorAluguel.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa:</span>
                  <span className="font-medium text-gray-800">
                    R$ {taxaServico.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            )}

            <div className="border-t-2 border-dashed border-gray-100 pt-4 flex justify-between items-center">
              <span className="font-serif font-bold text-lg text-gray-900">
                Total:
              </span>
              <span className="text-2xl font-serif font-extrabold text-gray-900">
                R${" "}
                {totalDias > 0
                  ? valorTotal.toFixed(2).replace(".", ",")
                  : "0,00"}
              </span>
            </div>

            <button
              type="submit"
              disabled={totalDias === 0}
              className="w-full py-4 bg-gray-200 text-gray-800 hover:bg-blue-600 hover:text-white rounded-2xl font-serif text-lg font-bold transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-gray-100/10"
            >
              Solicitar reserva
            </button>
          </form>
        </aside>
      </div>

      <style jsx global>{`
        .custom-calendar .rdp {
          --rdp-cell-size: 40px;
          --rdp-accent-color: #2563eb;
          --rdp-background-color: #dbeafe;
          margin: 0;
        }
        .custom-calendar .rdp-nav_button {
          border-radius: 8px;
        }
        .custom-calendar .rdp-head_cell {
          color: #9ca3af;
          font-weight: 700;
        }
      `}</style>
    </main>
  );
}
