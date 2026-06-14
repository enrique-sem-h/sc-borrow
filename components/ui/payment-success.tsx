"use client";

import { CheckCircle2, X, AlertCircle } from "lucide-react";

interface PagamentoSucessoModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "success" | "error"; 
  valorTotal?: string; 
  itemNome?: string;   
}

export function PagamentoSucessoModal({ 
  isOpen, 
  onClose, 
  status, 
  valorTotal, 
  itemNome 
}: PagamentoSucessoModalProps) {
  
  if (!isOpen) return null;

  const isSuccess = status === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl p-12 shadow-2xl relative border border-gray-100 text-center animate-in fade-in zoom-in duration-300">
        
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-black transition"
        >
          <X size={24} />
        </button>

        <h1 className="text-4xl font-['Shrikhand'] tracking-tight text-black mb-5">
          BORROW
        </h1>

        <div className="w-full h-px bg-gray-200 mb-8" />
        
        {isSuccess ? (
          <>
            <div className="flex justify-center mb-5 text-emerald-500">
              <CheckCircle2 size={64} strokeWidth={1.5} />
            </div>

            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-3">
              Pagamento Aprovado!
            </h2>
            <p className="text-gray-500 font-medium text-lg max-w-sm mx-auto mb-8">
              Sua transação via Stripe foi processada e confirmada com sucesso.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200/60 text-left text-base text-gray-600 space-y-2 mb-8 font-medium max-w-md mx-auto">
              <p>
                <span className="text-gray-400 font-normal">Item:</span> {itemNome || "Item Locado"}
              </p>
              <p>
                <span className="text-gray-400 font-normal">Valor Pago:</span> {valorTotal || "Processado"}
              </p>
              <p>
                <span className="text-gray-400 font-normal">Status:</span> Pago com sucesso
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-serif font-bold rounded-2xl transition text-lg max-w-md mx-auto block shadow-lg shadow-blue-100"
            >
              Ir para Meus aluguéis
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-5 text-[#f0655d]">
              <AlertCircle size={64} strokeWidth={1.5} />
            </div>

            <h2 className="text-5xl font-serif font-bold text-gray-900 mb-6">
              Desculpe!
            </h2>
            
            <p className="text-gray-700 text-2xl font-serif font-medium leading-relaxed max-w-md mx-auto mb-10 px-2">
              Ocorreu um problema na solicitação de aluguel.
              <span className="block text-gray-500 text-xl mt-2 font-sans font-normal">
                (Tente novamente mais tarde)
              </span>
            </p>

            <button
              onClick={onClose}
              className="w-full py-4 bg-[#f0655d] hover:bg-red-600 text-white font-bold rounded-2xl transition text-lg max-w-md mx-auto block shadow-lg shadow-red-100"
            >
              Fechar e tentar novamente
            </button>
          </>
        )}
      </div>
    </div>
  );
}