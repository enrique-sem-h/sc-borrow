"use client";

import { useState } from "react";
import LoginModal from "@/components/ui/login-modal";
import { Shrikhand } from "next/font/google";

const shrikhand = Shrikhand({ 
  weight: "400", 
  subsets: ["latin"], 
  display: "swap" 
});  

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const categories = [
    {
      title: "Ferramentas",
      image:
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Camping",
      image:
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Equipamentos de festa",
      image:
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Lazer",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const products = [
    {
      name: "Furadeira Tramontina",
      price: "R$ 35/dia",
      image:
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1200&auto=format&fit=crop",
      rating: "5.0",
    },
    {
      name: "Barraca 4 Pessoas",
      price: "R$ 60/dia",
      image:
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop",
      rating: "4.9",
    },
    {
      name: "Caixa de Som JBL",
      price: "R$ 80/dia",
      image:
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1200&auto=format&fit=crop",
      rating: "5.0",
    },
    {
      name: "Stand Up Paddle",
      price: "R$ 50/dia",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
      rating: "5.0",
    },
  ];   // as foto e de ia, preguica de pesquisar 

  return (
    <main className="min-h-screen bg-[#f5f5f5]">

      <header className="w-full bg-white border-b border-gray-200 px-8 py-4">

        <div className="flex items-center justify-between">

          <h1 className="text-4xl font-['Shrikhand'] tracking-tight">
            BORROW
          </h1>

          <div className="flex items-center bg-[#f5f5f5] border border-gray-300 rounded-full px-5 py-3 w-[600px]">

            <input
              type="text"
              placeholder="Buscar"
              className="
                bg-transparent
                flex-1
                outline-none
                text-lg
                placeholder:text-gray-500
              "
            />

            <span className="text-2xl">⌕</span>
          </div>

          <div className="flex items-center gap-8 text-lg text-gray-700">

            <button className="hover:text-black transition">
              Meus anúncios
            </button>

            <button className="hover:text-black transition">
              Chat
            </button>

            <button className="hover:text-black transition">
              🔔
            </button>

            <button
              onClick={() => setIsLoginOpen(true)}
              className="
                border
                border-gray-300
                rounded-xl
                px-8
                py-2
                hover:bg-gray-100
                transition
              "
            >
              Entrar
            </button>

            <button
              className="
                border
                border-gray-300
                rounded-xl
                px-8
                py-2
                hover:bg-gray-100
                transition
              "
            >
              Anunciar
            </button>
          </div>
        </div>
      </header>

      <section className="px-10 py-12">

        <h2 className="text-5xl font-bold text-center mb-16">
          Tudo o que você precisa, emprestado!
        </h2>

        <div className="grid grid-cols-4 gap-8 mb-16">

          {categories.map((category) => (
            <div
              key={category.title}
              className="
                bg-white
                rounded-3xl
                overflow-hidden
                shadow-md
                hover:shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-300
                cursor-pointer
              "
            >

              <img
                src={category.image}
                alt={category.title}
                className="
                  w-full
                  h-[240px]
                  object-cover
                "
              />

              <div className="p-5">

                <h3 className="text-3xl font-bold">
                  {category.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-4xl font-bold mb-8">
          Próximo a você
        </h2>

        <div className="grid grid-cols-4 gap-8">  

          {products.map((product) => (
            <div
              key={product.name}
              className="
                bg-white
                rounded-3xl
                overflow-hidden
                shadow-md
                hover:shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-300
                cursor-pointer
              "
            >

              <img
                src={product.image}
                alt={product.name}
                className="
                  w-full
                  h-[220px]
                  object-cover
                "
              />

              <div className="p-5">

                <div className="flex items-center justify-between mb-2">

                  <h3 className="text-lg font-semibold">
                    {product.name}
                  </h3>

                  <span className="text-sm text-green-600">
                    ● {product.rating} ★
                  </span>
                </div>

                <p className="text-xl font-bold">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </main>
  );
}