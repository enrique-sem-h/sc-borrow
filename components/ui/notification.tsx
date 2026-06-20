"use client";

import type { NotificacaoDTO } from "@/server/types";
import { AlertTriangle, X } from "lucide-react";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificacaoDTO[];
  isLoading?: boolean;
  error?: string | null;
  onMarkAsRead?: (id: string) => void;
}

export const NotificationsDropdown = ({
  isOpen,
  onClose,
  notifications,
  isLoading = false,
  error = null,
  onMarkAsRead,
}: NotificationsDropdownProps) => {
  if (!isOpen) return null;

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
          {isLoading ? (
            <div className="px-8 py-8 text-center text-gray-500">
              Carregando notificacoes...
            </div>
          ) : error ? (
            <div className="px-8 py-8 text-center text-gray-500">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="px-8 py-8 text-center text-gray-500">
              Nenhuma notificacao.
            </div>
          ) : (
            notifications.map((notif, index) => (
              <div key={notif.id}>
                <button
                  type="button"
                  onClick={() => onMarkAsRead?.(notif.id)}
                  className={`flex w-full items-start gap-4 px-8 py-5 text-left text-base leading-relaxed transition hover:bg-gray-50 ${
                    notif.read ? "text-gray-500" : "text-gray-800"
                  }`}
                >
                  <AlertTriangle
                    size={22}
                    className="mt-0.5 shrink-0 text-gray-900"
                  />
                  <span>
                    <span className="block font-semibold">{notif.title}</span>
                    <span>{notif.message}</span>
                  </span>
                </button>

                {index < notifications.length - 1 && (
                  <div className="mx-8 h-px bg-gray-100" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
