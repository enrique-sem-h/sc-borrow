"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AndamentoLocatarioPage() {
  const router = useRouter();

  const item = {
    name: "Barraca de camp",
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&q=80",
    dates: "10 - 14 Abr",
    pricePerDay: "R$ 150",
    daysCount: 3,
    subtotal: "R$450,00",
    deposit: "R$600,00",
    serviceFee: "R$ 30,00",
    totalPrice: "R$1080,00"
  };

  const timelineSteps = [
    { label: "Pedido realizado com sucesso", isCompleted: true },
    { label: "Pedido confirmado pelo locador", isCompleted: true },
    { label: "Locador realizando checklist de entrega", isCompleted: false },
    { label: "Checklist disponível para visualização", isCompleted: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
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
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-end px-1">
              <div>
                <h3 className="font-serif font-bold text-xl text-gray-900 leading-tight">{item.name}</h3>
                <p className="text-xs text-gray-400 font-medium mt-1">{item.dates}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">{item.pricePerDay}</span>
                <span className="block text-[10px] text-green-500 font-bold bg-green-50 px-1.5 py-0.5 rounded-md mt-1 text-center border border-green-100">● Ativo</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 border border-gray-200/80 rounded-2xl p-6 bg-white shadow-sm h-full flex flex-col justify-between">
            <div className="space-y-3 font-medium text-gray-600 text-base">
              <div className="flex justify-between">
                <span className="text-gray-400">Valor:</span>
                <span className="text-gray-400">{item.pricePerDay} x {item.daysCount} dias</span>
                <span className="text-gray-800 font-semibold">{item.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Caução</span>
                <span className="text-gray-800 font-semibold">{item.deposit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Taxa de serviço</span>
                <span className="text-gray-800 font-semibold">{item.serviceFee}</span>
              </div>
              <div className="w-full h-px bg-gray-100 my-4" />
              <div className="flex justify-between text-lg font-bold text-gray-900 font-serif">
                <span>Total</span>
                <span>{item.totalPrice}</span>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => alert("Fluxo de cancelamento iniciado")}
                className="px-6 py-2 bg-[#f0655d] hover:bg-red-600 text-white text-sm font-bold rounded-full shadow-md shadow-red-100 transition"
              >
                Cancelar pedido
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-3xl mx-auto border-t border-gray-100 pt-8">
          <h4 className="text-xl font-serif font-bold text-gray-900 mb-6 px-1">Status atual</h4>
          <div className="relative pl-8 space-y-6">
            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-200" />
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 relative">
                <div 
                  className={`absolute -left-7 top-1.5 w-3.5 h-3.5 rounded-full z-10 border-2 bg-white transition-all ${
                    step.isCompleted ? "border-black bg-black scale-110" : "border-gray-400 bg-white"
                  }`} 
                />
                <p className={`text-base font-medium ${step.isCompleted ? "text-gray-900 font-semibold" : "text-gray-400"}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-gray-200 my-8 max-w-3xl mx-auto" />

        <div className="flex justify-center items-center gap-3 max-w-xl mx-auto">
          <button
            onClick={() => router.push("/checklist/confirma-entrega")} 
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-serif font-semibold rounded-xl text-base transition shadow-sm"
          >
            Checklist de entrega
          </button>
          <button
            onClick={() => router.push("/checklist/devolucao-locador")} 
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-serif font-semibold rounded-xl text-base transition shadow-sm"
          >
            Checklist de devolução
          </button>
          <button
            onClick={() => router.push("/chats")} 
            className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-serif font-semibold rounded-xl text-base transition shadow-sm"
          >
            Chat
          </button>
        </div>

      </div>
    </div>
  );
}