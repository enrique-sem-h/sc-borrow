import { X } from "lucide-react";

interface RentalCancelledModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemImageUrl: string;
}

export const RentalCancelledModal = ({
  isOpen,
  onClose,
  itemName,
  itemImageUrl,
}: RentalCancelledModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-12 max-w-xl w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-300">

        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={28} />
        </button>

        <h2 className="text-5xl font-['Shrikhand'] mb-5">BORROW</h2>

        <div className="w-full h-px bg-gray-200 mb-10" />

        <h3 className="text-4xl font-serif font-bold mb-8 text-gray-900">
          Seu aluguel foi cancelado
        </h3>

        <div className="bg-gray-100 rounded-2xl p-6 flex items-center gap-5 border border-gray-200/60 max-w-md mx-auto text-left">
          <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden shrink-0 border-2 border-white shadow-md">
            {itemImageUrl ? (
              <img
                src={itemImageUrl}
                alt={itemName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
          
          <span className="font-serif text-2xl font-bold text-gray-800">
            {itemName}
          </span>
        </div>

      </div>
    </div>
  );
};