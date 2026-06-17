"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/ui/login-modal";
import { Shrikhand } from "next/font/google";
import RegisterModal from "@/components/ui/register-modal";

const shrikhand = Shrikhand({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface AnuncioCard {
  id: string;
  titulo: string;
  valorDiario: number;
  foto_principal: string | null;
}

export default function Home() {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [anunciosReais, setAnunciosReais] = useState<AnuncioCard[]>([]);

  const onRegisterBtnClick = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  useEffect(() => {
    fetch("/api/anuncios")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setAnunciosReais(data);
      })
      .catch(() => {});
  }, []);

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
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <section className="px-10 py-12">
        <h2 className="text-5xl font-bold text-center mb-16">
          Tudo o que você precisa, emprestado!
        </h2>

        <div className="grid grid-cols-4 gap-8 mb-16">
          {categories.map((category) => (
            <div
              key={category.title}
              onClick={() =>
                router.push(
                  `/busca?categoria=${encodeURIComponent(category.title)}`,
                )
              }
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
                <h3 className="text-3xl font-bold">{category.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-4xl font-bold mb-8">Próximo a você</h2>

        <div className="grid grid-cols-4 gap-8">
          {(anunciosReais.length > 0
            ? anunciosReais.map((a) => ({
                id: a.id,
                name: a.titulo,
                price: `R$ ${a.valorDiario}/dia`,
                image: a.foto_principal,
                rating: "5.0",
              }))
            : products.map((p) => ({ ...p, id: null }))
          ).map((product) => (
            <div
              key={product.id ?? product.name}
              onClick={() =>
                product.id && router.push(`/detalhesanuncio/${product.id}`)
              }
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
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[220px] object-cover"
                />
              ) : (
                <div className="w-full h-[220px] bg-gray-100 flex items-center justify-center text-gray-300 text-4xl">
                  📷
                </div>
              )}

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <span className="text-sm text-green-600">
                    ● {product.rating} ★
                  </span>
                </div>
                <p className="text-xl font-bold">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
