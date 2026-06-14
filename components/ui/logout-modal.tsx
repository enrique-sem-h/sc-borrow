import { LogOut, Undo2 } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-12 max-w-xl w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">

        <h2 className="text-5xl font-['Shrikhand'] mb-5">
          BORROW
        </h2>

        <div className="w-full h-px bg-gray-200 mb-10" />

        <h3 className="text-4xl font-serif font-bold mb-6 text-gray-900">
          Sair da conta?
        </h3>

        <p className="text-gray-600 text-xl leading-relaxed mb-10">
          Tem certeza que deseja sair da sua conta?
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={onConfirm}
            className="bg-[#f0655d] text-white text-lg py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-600 transition"
          >
            <LogOut size={22} />
            Confirmar e sair
          </button>

          <button
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
