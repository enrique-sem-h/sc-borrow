"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface ConfirmedOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfirmedOrderModal({ isOpen, onClose }: ConfirmedOrderModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoToChecklist = () => {
    onClose();
    router.push("/checklist/enviar-locatario");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-12 max-w-xl w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300 relative">
        
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-black transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-5xl font-['Shrikhand'] mb-5">BORROW</h2>

        <div className="w-full h-px bg-gray-200 mb-10" />

        <h3 className="text-4xl font-serif font-bold mb-4 text-gray-900">
          Pedido confirmado!
        </h3>

        <div className="text-gray-500 font-medium text-lg leading-relaxed max-w-md mx-auto mb-10 space-y-2">
          <p>Você confirmou este pedido com sucesso.</p>
          <p className="text-base text-gray-400">
            No momento da entrega, não se esqueça de realizar o check-in para registrar que o item foi entregue ao locatário.
          </p>
        </div>

        <button
          onClick={handleGoToChecklist}
          className="w-full bg-gray-100 text-gray-800 text-lg py-4 rounded-2xl font-bold font-serif hover:bg-gray-200 transition shadow-sm"
        >
          Checklist de entrega
        </button>

      </div>
    </div>
  );
}