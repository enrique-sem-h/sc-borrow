"use client";

import { CheckCircle2, X } from "lucide-react";

interface PagamentoSucessoModalProps {
  isOpen: boolean;
  onClose: () => void;
  valorTotal?: string; 
  itemNome?: string;   
}

export function PagamentoSucessoModal({ isOpen, onClose, valorTotal, itemNome }: PagamentoSucessoModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl relative border border-gray-100 text-center">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition"
        >
          <X size={20} />
        </button>

        <h1 className="text-2xl font-['Shrikhand'] font-bold tracking-tight text-black mb-4">
          BORROW
        </h1>
        
        <div className="flex justify-center mb-4 text-emerald-500">
          <CheckCircle2 size={56} strokeWidth={1.5} />
        </div>

        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Pagamento Aprovado!</h2>
        <p className="text-gray-500 font-medium mb-6 text-sm">
          Sua transação via Stripe foi processada e confirmada com sucesso.
        </p>

        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/80 text-left text-xs text-gray-600 space-y-1.5 mb-6 font-medium">
          <p>
            <span className="text-gray-400">Item:</span> {itemNome || "Item Locado"} {/*trocar dps*/}
          </p>
          <p>
            <span className="text-gray-400">Valor Pago:</span> {valorTotal || "Processado"}
          </p>
          <p>
            <span className="text-gray-400">Status:</span> Pago com sucesso
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-serif font-bold rounded-xl transition-all shadow-md shadow-blue-100 text-sm"
        >
          Ir para Meus aluguéis
        </button>
      </div>
    </div>
  );
}