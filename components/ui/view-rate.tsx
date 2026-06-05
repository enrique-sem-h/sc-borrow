"use client";

import { Star, X } from "lucide-react";

interface VisualizarAvaliarModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemNome: string;
  periodoLocacao: string;
  nota: number;       
  comentario: string; 
}

export function VisualizarAvaliarModal({ 
  isOpen, 
  onClose, 
  itemNome, 
  periodoLocacao, 
  nota, 
  comentario 
}: VisualizarAvaliarModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-white rounded-[28px] p-8 shadow-2xl relative border border-gray-100 animate-scale-up">

        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-gray-400 hover:text-black transition"
        >
          <X size={18} />
        </button>

        <h1 className="text-center text-2xl font-['Shrikhand'] tracking-tight mb-2">BORROW</h1>
        <div className="border-b border-gray-100 mb-4" />
        
        <h2 className="text-xl font-serif font-bold text-center text-gray-900 mb-1">Sua Avaliação</h2>
        <p className="text-center text-xs text-gray-400 font-medium mb-6">
          <span className="font-bold text-gray-700">{itemNome}</span> (Locação de {periodoLocacao})
        </p>

        <div className="space-y-5">
          <div className="flex flex-col items-center">
            <div className="flex gap-2 bg-gray-50 px-6 py-3 rounded-full border border-gray-100/70">
              {[1, 2, 3, 4, 5].map((estrela) => (
                <Star
                  key={estrela}
                  size={28}
                  className={estrela <= nota ? "fill-gray-900 text-gray-900" : "text-gray-200"}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-800 mb-1.5 ml-1">Seu comentário:</label>
            <div className="w-full border border-gray-100 bg-gray-50/50 rounded-2xl p-4 min-h-24 text-sm text-gray-600 font-medium italic">
              "{comentario || "Nenhum comentário deixado."}"
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-gray-900 hover:bg-black text-white font-serif font-bold rounded-xl transition-all shadow-md"
            >
              Fechar visualização
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}