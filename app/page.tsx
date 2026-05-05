"use client";

import { useState } from "react";
import LoginModal from "@/components/ui/login-modal";

export default function Home() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <main className="bg-gray-100 min-h-screen">
      
      <div className="w-full mx-auto bg-white min-h-screen shadow-sm">

        <div className="flex items-center justify-between px-8 py-4 border-b">
          
          <h1 className="text-2xl font-extrabold italic tracking-tight">
            BORROW
          </h1>

          <div className="flex items-center border rounded-full px-4 py-2 w-[400px] bg-gray-100">
            <input
              type="text"
              placeholder="Buscar"
              className="bg-transparent outline-none flex-1 text-sm"
            />
            <span>🔍</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600 cursor-pointer hover:text-black">
              Meus anúncios
            </span>
            <span className="text-sm text-gray-600 cursor-pointer hover:text-black">
              Chat
            </span>
            <span className="text-sm text-gray-600 cursor-pointer hover:text-black">
              🔔
            </span>

            <button
              onClick={() => setOpenModal(true)}
              className="border px-4 py-1 rounded-md hover:bg-gray-100 transition"
            >
              Entrar
            </button>

            <button className="border px-4 py-1 rounded-md hover:bg-gray-100 transition">
              Anunciar
            </button>
          </div>
        </div>

        <h2 className="text-4xl font-extrabold text-center mt-10 mb-10 tracking-tight">
          Tudo o que você precisa, emprestado!
        </h2>

        <div className="grid grid-cols-4 gap-6 px-8">
          {[
            { title: "Ferramentas", img: "/furadeira.png" },
            { title: "Camping", img: "/barraca.png" },
            { title: "Equipamentos de festa", img: "/som.png" },
            { title: "Lazer", img: "/prancha.png" },  // colocar as fotos dps
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer
                         hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <img
                src={item.img}
                className="w-full h-[160px] object-contain bg-gray-100"
              />
              <div className="p-4 text-lg font-semibold">
                {item.title}
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-bold mt-10 px-8">
          Próximo a você
        </h3>

        <div className="grid grid-cols-4 gap-6 mt-6 px-8 pb-10">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl shadow-md p-3 cursor-pointer
                         hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <div className="bg-gray-200 h-[120px] rounded-md mb-2" />

              <p className="text-sm">Furadeira Tramontina</p>
              <p className="text-sm font-semibold">R$ 35/dia</p>

              <div className="flex justify-end items-center text-sm mt-2">
                <span className="text-green-500">●</span>
                <span className="ml-1">5.0 ★</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      <LoginModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </main>
  );
}