"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, Image as ImageIcon } from "lucide-react";

const CATEGORIAS = ["Ferramentas", "Camping", "Equipamentos de festa", "Lazer"];

interface Anuncio {
  id: string;
  titulo: string;
  valor_diario: number;
  categoria: string;
  avaliacao: number;
  disponivel: boolean;
  foto: string | null;
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(value === s ? 0 : s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="transition"
        >
          <Star
            size={22}
            className={
              s <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors duration-200 flex items-center px-1 ${
        checked ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function CardAnuncio({ anuncio, onClick }: { anuncio: Anuncio; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-gray-100"
    >
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
        {anuncio.foto ? (
          <img src={anuncio.foto} alt={anuncio.titulo} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={40} strokeWidth={1} className="text-gray-300" />
        )}
      </div>
      <div className="p-4">
        <p className="text-base font-semibold text-gray-900 leading-snug mb-1 line-clamp-1">
          {anuncio.titulo}
        </p>
        <p className="text-lg font-bold text-gray-900 mb-2">
          R$ {anuncio.valor_diario}/dia
        </p>
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <span className={`w-2 h-2 rounded-full ${anuncio.disponivel ? "bg-green-500" : "bg-yellow-400"}`} />
          <span>{anuncio.avaliacao.toFixed(1)}</span>
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
        </div>
      </div>
    </div>
  );
}

function BuscaContent() {
  const router = useRouter();
  const params = useSearchParams();

  if (!params) return null;

  const queryParam    = params.get("q") ?? "";
  const categoriaParam = params.get("categoria") ?? "";

  const [todosAnuncios, setTodosAnuncios] = useState<Anuncio[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(categoriaParam);
  const [precoMax, setPrecoMax] = useState(10000);
  const [avaliacaoMin, setAvaliacaoMin] = useState(0);
  const [disponibilidade, setDisponibilidade] = useState(false);
  const [ordenar, setOrdenar] = useState("recomendados");

  useEffect(() => {
    async function carregar() {
      try {
        const qs = new URLSearchParams();
        if (queryParam) qs.set("q", queryParam);
        if (categoriaParam) qs.set("categoria", categoriaParam);
        const res = await fetch(`/busca/api?${qs.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setTodosAnuncios(data);
        }
      } catch {
        setTodosAnuncios([]);
      }
    }
    carregar();
  }, [queryParam, categoriaParam]);

  useEffect(() => {
    setCategoriaAtiva(categoriaParam);
  }, [categoriaParam]);

  const resultados = todosAnuncios
    .filter((a) => {
      if (queryParam && !a.titulo.toLowerCase().includes(queryParam.toLowerCase())) return false;
      if (categoriaAtiva && a.categoria !== categoriaAtiva) return false;
      if (a.valor_diario > precoMax) return false;
      if (avaliacaoMin > 0 && a.avaliacao < avaliacaoMin) return false;
      if (disponibilidade && !a.disponivel) return false;
      return true;
    })
    .sort((a, b) => {
      if (ordenar === "menor_preco") return a.valor_diario - b.valor_diario;
      if (ordenar === "maior_preco") return b.valor_diario - a.valor_diario;
      if (ordenar === "avaliacao")   return b.avaliacao - a.avaliacao;
      return 0;
    });

  const titulo = queryParam
    ? `"${queryParam}"`
    : categoriaAtiva
    ? `"${categoriaAtiva}"`
    : "todos os itens";

  return (
    <main className="min-h-screen bg-[#f5f5f5] font-sans">
      <div className="max-w-[1400px] mx-auto px-8 py-10 flex gap-10 items-start">

        {/* Painel de Filtros */}
        <aside className="w-56 shrink-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Filtros</h2>

          {/* Categorias */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <p className="text-base font-bold text-gray-700 mb-3">Categorias</p>
            <div className="flex flex-col gap-1">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    const nova = categoriaAtiva === cat ? "" : cat;
                    const qs = new URLSearchParams();
                    if (queryParam) qs.set("q", queryParam);
                    if (nova) qs.set("categoria", nova);
                    router.push(`/busca?${qs.toString()}`);
                  }}
                  className={`text-left text-sm px-3 py-1.5 rounded-xl transition font-medium ${
                    categoriaAtiva === cat
                      ? "bg-gray-200 text-gray-900 font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Preço */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <p className="text-base font-bold text-gray-700 mb-3">Preço</p>
            <input
              type="range"
              min={10}
              max={10000}
              step={10}
              value={precoMax}
              onChange={(e) => setPrecoMax(Number(e.target.value))}
              className="w-full accent-gray-800"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>R$ 10</span>
              <span>R$ {precoMax.toLocaleString("pt-BR")}</span>
            </div>
          </div>

          {/* Distância */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <p className="text-base font-bold text-gray-700 mb-3">Distância</p>
            <input
              type="range"
              min={1}
              max={1000}
              step={1}
              defaultValue={1000}
              className="w-full accent-gray-800"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0,1 km</span>
              <span>1.000 km</span>
            </div>
          </div>

          {/* Avaliação */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <p className="text-base font-bold text-gray-700 mb-3">Avaliação do locador</p>
            <StarRating value={avaliacaoMin} onChange={setAvaliacaoMin} />
          </div>

          {/* Disponibilidade */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-gray-700">Disponibilidade imediata</p>
              <Toggle checked={disponibilidade} onChange={setDisponibilidade} />
            </div>
          </div>
        </aside>

        {/* Resultados */}
        <section className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              {resultados.length} Resultado{resultados.length !== 1 ? "s" : ""} para {titulo}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Ordenar por:</span>
              <select
                value={ordenar}
                onChange={(e) => setOrdenar(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-sm outline-none cursor-pointer"
              >
                <option value="recomendados">Recomendados</option>
                <option value="menor_preco">Menor preço</option>
                <option value="maior_preco">Maior preço</option>
                <option value="avaliacao">Melhor avaliação</option>
              </select>
            </div>
          </div>

          {resultados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <ImageIcon size={56} strokeWidth={1} />
              <p className="mt-4 text-lg font-medium">Nenhum resultado encontrado</p>
              <p className="text-sm mt-1">Tente ajustar os filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {resultados.map((anuncio) => (
                <CardAnuncio
                  key={anuncio.id}
                  anuncio={anuncio}
                  onClick={() => router.push(`/detalhesanuncio/${anuncio.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function BuscaPage() {
  return (
    <Suspense>
      <BuscaContent />
    </Suspense>
  );
}
