import { LogOut, Undo2 } from "lucide-react";
import { Input } from "./input";
import { useRef } from "react";
import { Spinner } from "./spinner";

interface ResgatarSaldoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const ResgatarSaldoModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: ResgatarSaldoModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = () => {
    const inputValue = inputRef.current!.value;

    if (!inputValue) {
      return;
    }

    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-12 max-w-xl w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <h2 className="text-5xl font-['Shrikhand'] mb-5">BORROW</h2>

        <div className="w-full h-px bg-gray-200 mb-10" />

        <span className="size-5 font-bold text-lg mb-4">
          Por favor, digite sua chave PIX para resgatar o saldo
        </span>

        <div className="my-3">
          <Input ref={inputRef} placeholder="Chave pix" />
        </div>

        <div className="flex flex-row gap-4 w-full">
          <button
            onClick={onClose}
            className="bg-[#f0655d] text-white text-lg py-4 rounded-2xl font-bold gap-3 hover:bg-red-600 transition block w-full"
          >
            Fechar
          </button>

          <button
            onClick={onSubmit}
            className="border border-gray-300 text-blue-500 text-lg py-4 rounded-2xl font-bold  gap-3 bg-green hover:bg-green-50 transition block w-full"
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <Spinner className="size-5" />
              </div>
            ) : (
              "Confirmar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
