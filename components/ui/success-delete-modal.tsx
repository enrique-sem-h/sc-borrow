import { X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
}

export const SuccessModal = ({ isOpen, onClose, itemName }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-['Shrikhand'] mb-6">BORROW</h2>
        
        <h3 className="text-3xl font-serif font-bold mb-6 decoration-4 text-center">
          Seu anúncio foi excluído
        </h3>
        
        <div className="bg-gray-100 p-6 rounded-xl flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-gray-300 rounded-full shrink-0" />
          <span className="text-xl font-serif font-bold truncate">{itemName}</span>
        </div>
      </div>
    </div>
  );
};