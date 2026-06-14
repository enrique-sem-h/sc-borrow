import { Trash, Undo2, AlertTriangle } from "lucide-react";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  hasFee: boolean; 
}

export const CancelModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  hasFee,
}: CancelModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-12 max-w-xl w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        
        <h2 className="text-5xl font-['Shrikhand'] mb-5">BORROW</h2>

        <div className="w-full h-px bg-gray-200 mb-10" />

        <h3 className="text-3xl font-serif font-bold mb-6 text-gray-900">
          Confirmar cancelamento?
        </h3>

        <p className="text-gray-600 text-xl leading-relaxed mb-8">
          Você tem certeza que deseja cancelar o aluguel de:
          <span className="font-bold text-gray-900"> {itemName}</span>?
        </p>

        <div className="flex items-start gap-4 text-left bg-red-50 border border-red-100 p-5 rounded-2xl mb-10 text-base text-gray-700">
          <AlertTriangle size={24} className="shrink-0 mt-1 text-red-500" />
          
          {hasFee ? (
            <p className="leading-relaxed text-[#f0655d] font-semibold">
              Atenção: Será cobrada uma taxa de 30% do valor da reserva no cancelamento em cima do prazo!
            </p>
          ) : (
            <div className="leading-relaxed space-y-1">
              <p className="font-bold">Atenção:</p>
              <p>Esta ação não poderá ser desfeita. O aluguel será cancelado!</p>
              <p>Estornaremos o valor de <span className="font-bold text-gray-900">R$104,00</span> em até 3 dias úteis.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={onConfirm}
            className="bg-[#f0655d] text-white text-lg py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-600 transition"
          >
            <Trash size={22} />
            Confirmar e cancelar
          </button>

          <button
            type="button"
            onClick={onClose}
            className="border border-gray-300 text-blue-500 text-lg py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >
            <Undo2 size={22} />
            Cancelar e voltar
          </button>
        </div>

      </div>
    </div>
  );
};