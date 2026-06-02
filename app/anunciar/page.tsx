"use client";
import { ChevronLeft, UploadCloud, Image as ImageIcon, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function CriarAnuncioPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorDiario, setValorDiario] = useState("");
  const [caucao, setCaucao] = useState("");
  const [condicao, setCondicao] = useState("");
  const [tamanho, setTamanho] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSalvarAnuncio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !categoria || !descricao || !valorDiario || !caucao) {
      alert("Por favor, preencha todos os campos obrigatórios (*)");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/anunciar/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo,
          categoria,
          descricao,
          valor_diario: valorDiario.replace(",", "."),
          caucao: caucao.replace(",", "."),
          condicao, 
          tamanho
        }),
      });

      if (response.ok) {
        setShowModal(true);
      } else {
        const erroData = await response.json();
        alert(erroData.error || "Erro ao criar anúncio.");
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
      alert("Erro na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-full bg-white flex flex-col overflow-hidden font-sans text-[#1a1a1a]">
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
      />

      <header className="px-12 py-6 flex items-center gap-6 shrink-0">
        <button
          onClick={() => router.back()}
          className="hover:bg-gray-100 p-2 rounded-full transition-all"
        >
          <ChevronLeft size={32} strokeWidth={2.5} className="text-gray-800" />
        </button>

        <h2 className="text-4xl font-serif font-bold tracking-tight">
          Criar anúncio
        </h2>
      </header>

      <div className="flex-1 flex flex-row gap-10 px-12 pb-8 min-h-0 max-w-[1600px] mx-auto w-full items-stretch">

        <section className="w-[340px] xl:w-[380px] flex flex-col shrink-0 self-start">
          <h3 className="text-lg font-serif mb-4 text-gray-800 ml-1">
            Galeria de fotos
          </h3>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-[420px] bg-white rounded-[40px] shadow-xl shadow-gray-100 border border-gray-100 flex flex-col items-center justify-center mb-6 transition-all hover:bg-gray-50 cursor-pointer"
          >
            <UploadCloud size={48} className="text-gray-300 mb-4" strokeWidth={1} />
            <p className="text-lg font-medium text-gray-500">Upload de fotos</p>
            <p className="text-xs text-gray-300 mt-2">Clique para adicionar foto</p>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6 shrink-0">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square bg-[#f8f9fa] rounded-2xl border border-gray-100 flex items-center justify-center"
              >
                <ImageIcon size={20} className="text-gray-300" />
              </div>
            ))}
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 rounded-2xl border border-gray-300 text-lg font-serif font-medium hover:bg-gray-50 transition-all text-gray-700"
          >
            Adicionar fotos
          </button>
        </section>

        <section className="flex-[2.5] bg-[#fcfcfc] rounded-[48px] border border-gray-100 shadow-2xl shadow-gray-200/40 flex flex-col min-h-0 self-start max-h-[82vh]">
          <div className="px-12 pt-8 pb-4 shrink-0">
            <h3 className="text-2xl font-serif text-gray-900 font-bold">
              Informações básicas
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto px-12 pb-10 space-y-6 custom-scrollbar">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8">
                <Label text="Título do anúncio" required />
                <Input 
                  placeholder="Ex: Furadeira de Impacto Bosch" 
                  value={titulo} 
                  onChange={(e: any) => setTitulo(e.target.value)} 
                />
              </div>

              <div className="col-span-4">
                <Label text="Categoria" required />  
                <div className="relative">
                  <select 
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 appearance-none outline-none focus:ring-4 focus:ring-blue-50/50 shadow-sm transition-all text-gray-600 text-sm"
                  >
                    <option value="">Selecione...</option>
                    <option value="Ferramentas">Ferramentas</option>
                    <option value="Camping">Camping</option>
                    <option value="Equipamentos de festa">Equipamentos de festa</option>
                    <option value="Lazer">Lazer</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-[10px]">
                    ▼
                  </div>
                </div>
              </div>
            </div>
               
            <div>
              <Label text="Descrição detalhada" required />
              <textarea 
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Conte detalhes sobre o produto, voltagem, acessórios inclusos..."
                className="w-full bg-white border border-gray-200 rounded-2xl p-4 h-28 resize-none text-sm outline-none focus:ring-4 focus:ring-blue-50/50 shadow-sm transition-all placeholder:text-gray-300" 
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <Label text="Preço diário" required />
                <div className="relative">
                  <Input 
                    placeholder="0,00" 
                    value={valorDiario}
                    onChange={(e: any) => setValorDiario(e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs italic font-sans">
                    / dia *
                  </span>
                </div>
              </div>

              <div>
                <Label text="Depósito de caução" required />
                <Input 
                  placeholder="0,00" 
                  value={caucao}
                  onChange={(e: any) => setCaucao(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-xl font-serif font-bold mb-4 text-gray-800">
                Informações extras:
              </h4>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Label text="Condição do produto" optional />
                  <Input 
                    placeholder="Novo, usado..." 
                    value={condicao}
                    onChange={(e: any) => setCondicao(e.target.value)}
                  />
                </div>

                <div>
                  <Label text="Tamanho" optional />
                  <Input 
                    placeholder="Dimensões ou peso" 
                    value={tamanho}
                    onChange={(e: any) => setTamanho(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <p className="font-serif text-2xl font-bold mb-4">
                Ações finais
              </p>

              <button
                onClick={handleSalvarAnuncio}
                disabled={loading}
                className="w-full py-4 rounded-2xl border-2 border-blue-400 text-blue-600 font-serif text-xl font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all bg-white shadow-lg shadow-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Publicando..." : "Salvar anúncio"}
              </button>
            </div>
          </div>
        </section>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-[36px] p-10 shadow-2xl border border-gray-100">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check size={38} className="text-green-600" strokeWidth={3} />
            </div>

            <h3 className="text-3xl font-serif font-bold text-center text-gray-900 mb-3">
              Anúncio salvo!
            </h3>

            <p className="text-center text-gray-500 leading-relaxed mb-8">
              Seu anúncio foi publicado com sucesso.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
              >
                Fechar
              </button>

              <button
                onClick={() => router.push("/Meusanuncios")}
                className="flex-1 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all font-medium"
              >
                Ir para Meus anúncios
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </main>
  );
}

function Label({ text, required, optional }: { text: string; required?: boolean; optional?: boolean; }) {
  return (
    <label className="block text-gray-700 text-sm font-serif font-semibold mb-1.5 ml-1">
      {text}
      {required && <span className="text-red-500 ml-1 font-sans">*</span>}
      {optional && <span className="text-gray-400 text-[10px] ml-2 font-sans italic font-normal">(opcional)</span>}
    </label>
  );
}

function Input({ ...props }) {
  return (
    <input
      type="text"
      {...props}
      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-4 focus:ring-blue-50/50 shadow-sm transition-all placeholder:text-gray-300"
    />
  );
}