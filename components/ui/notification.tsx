"use client";

import { AlertTriangle, X } from "lucide-react";

interface NotificationItem {
  id: string;
  text: string;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDropdown = ({
  isOpen,
  onClose,
}: NotificationsDropdownProps) => {
  if (!isOpen) return null;

  const notifications: NotificationItem[] = [
    {
      id: "1",
      text: "Seu reembolso foi aprovado, o dinheiro já deve estar disponível na sua conta!",
    },
    {
      id: "2",
      text: "Seu pedido de reembolso está em processamento!",
    },
    {
      id: "3",
      text: "Você fez um pedido de reembolso, estamos analisando e iremos te responder em breve",
    },
    {
      id: "4",
      text: "O pagamento do aluguel: Barraca de camp, já está disponível na sua carteira BorrowPay",
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute right-0 mt-3 w-screen max-w-[450px] bg-white rounded-3xl border border-gray-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-3 duration-200 overflow-hidden">

        <div className="flex items-center justify-between px-8 pt-6 pb-4">
          <span className="font-['Shrikhand'] text-2xl tracking-wide text-black">
            BORROW
          </span>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="w-full h-px bg-gray-200" />

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.map((notif, index) => (
            <div key={notif.id}>
              <div className="flex items-start gap-4 px-8 py-5 hover:bg-gray-50 transition text-gray-800 text-base leading-relaxed">
                <AlertTriangle
                  size={22}
                  className="shrink-0 mt-0.5 text-gray-900" 
                />
                <p>{notif.text}</p>
              </div>
              
              {index < notifications.length - 1 && (
                <div className="mx-8 h-px bg-gray-100" />
              )}
            </div>
          ))}
        </div>

      </div>
    </>
  );
};