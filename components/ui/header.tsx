"use client";
import { useState } from "react";
import { Search, Bell, ClipboardList, MessageCircle } from "lucide-react";
import LoginModal from "@/components/ui/login-modal";

export default function Header() {
      const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
        <header className="w-full bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="flex items-center justify-between gap-4">

            <h1 className="text-3xl md:text-4xl font-['Shrikhand'] tracking-tight shrink-0">
            BORROW
            </h1>

            <div className="flex items-center bg-[#f5f5f5] border border-gray-300 rounded-lg px-5 py-3 w-full max-w-xl">
            <input
                type="text"
                placeholder="Buscar"
                aria-label="Buscar itens"
                className="bg-transparent flex-1 outline-none text-lg placeholder:text-gray-500"
                onKeyDown={(e) => {
                  // TODO: Realizar filtro de busca
                }}
            />
            <Search className="w-5 h-5 text-gray-500" aria-hidden="true" />
            </div>

            <div className="flex items-center gap-2 md:gap-4 text-lg text-gray-700">
            <button
                onClick={() => { /* TODO: ir para página "meus-anuncios" */ }}
                aria-label="Meus anúncios"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
                <ClipboardList className="w-5 h-5" aria-hidden="true" />
                <span className="hidden lg:inline">Meus anúncios</span>
            </button>

            <button
                onClick={() => { /* TODO: ir para página "chat" */ }}
                aria-label="Chat"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                <span className="hidden lg:inline">Chat</span>
            </button>

            <button
                onClick={() => { /* TODO: abrir as "notificações" */ }}
                aria-label="Notificações"
                className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
                <Bell className="w-5 h-5" aria-hidden="true" />
            </button>

            <button
                onClick={() => { /* TODO: ir para página "anunciar" */ }}
                className="border border-gray-300 rounded-xl px-4 md:px-8 py-2 hover:bg-gray-100 transition text-sm md:text-base"
            >
                Anunciar
            </button>

                        <button
                onClick={() => setIsLoginOpen(true)}
                className="border border-gray-300 rounded-xl px-4 md:px-8 py-2 hover:bg-gray-100 transition text-sm md:text-base"
            >
                Entrar
            </button>
            </div>

        </div>
        </header>

        <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            />
    </>
  );
}
