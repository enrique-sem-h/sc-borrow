import { X } from "lucide-react";

interface SuccessFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string; 
}

export const SuccessFeedbackModal = ({
  isOpen,
  onClose,
  message,
}: SuccessFeedbackModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-300">
        
        <div className="flex items-center justify-between mb-4">
          <span className="font-['Shrikhand'] text-2xl tracking-wide text-black">
            BORROW
          </span>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-50"
          >
            <X size={24} />
          </button>
        </div>

        <div className="w-full h-px bg-gray-200 mb-8" />

        <h3 className="text-3xl font-serif font-bold text-gray-900 leading-snug px-4 py-4">
          {message}
        </h3>

      </div>
    </div>
  );
};

// Quando for chamar o modal tem que colocar a mensagem dele | so copiar aqui: 
/*
      <SuccessFeedbackModal
        isOpen={modalEntregaAberto}
        onClose={() => setModalEntregaAberto(false)}
        message="Entrega confirmada com sucesso!"
      />

      <SuccessFeedbackModal
        isOpen={modalSolicitacaoEntregaAberto}
        onClose={() => setModalSolicitacaoEntregaAberto(false)}
        message="Solicitação de entrega enviada com sucesso!"
      />

      <SuccessFeedbackModal
        isOpen={modalDevolucaoAberto}
        onClose={() => setModalDevolucaoAberto(false)}
        message="Devolução confirmada com sucesso!"
      />

      <SuccessFeedbackModal
        isOpen={modalSolicitacaoDevolucaoAberto}
        onClose={() => setModalSolicitacaoDevolucaoAberto(false)}
        message="Solicitação de devolução enviada com sucesso!"
      />
*/