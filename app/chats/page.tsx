"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { ChevronLeft, Send, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";

// npx expo install firebase  | se precisar

import { dbFirebase } from "@/infra/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  doc,
  increment,
} from "firebase/firestore";

interface Mensagem {
  id: string;
  texto: string;
  remetenteId: string;
  timestamp: string;
  lida: boolean;
}

interface Conversa {
  id: string;
  nomeUsuario: string;
  itemAcordo: string;
  periodoAcordo: string;
  ultimaMensagem: string;
  naoLidas: number;
  idLocador: string;
  idLocatario: string;
}

type ChatFormValues = {
  mensagemTexto: string;
  buscaConversa: string;
};

function ChatsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const { user } = useAuth();
  const { chatCount } = useNotifications();
  const mensagensEndRef = useRef<HTMLDivElement | null>(null);

  const usuarioLogadoId = user?.id || "";

  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [conversaAtiva, setConversaAtiva] = useState<Conversa | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);

  const { handleSubmit, control, reset, watch } = useForm<ChatFormValues>({
    defaultValues: { mensagemTexto: "", buscaConversa: "" },
  });

  const termoBusca = watch("buscaConversa");
  const conversasFiltradas = conversas.filter(
    (c) =>
      c.nomeUsuario.toLowerCase().includes(termoBusca.toLowerCase()) ||
      c.itemAcordo.toLowerCase().includes(termoBusca.toLowerCase()),
  );

  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  useEffect(() => {
    if (!usuarioLogadoId) return;

    const conversasRef = collection(dbFirebase, "conversas");
    const q = query(
      conversasRef,
      where("participantes", "array-contains", usuarioLogadoId),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listaSalas = snapshot.docs.map((snapDoc) => {
        const dados = snapDoc.data();
        const isLocatario = dados.idLocatario === usuarioLogadoId;
        const nomeOutro = isLocatario
          ? dados.nomeLocador || "Proprietário"
          : dados.nomeLocatario || "Locatário";

        return {
          id: snapDoc.id,
          nomeUsuario: nomeOutro,
          itemAcordo: dados.itemAcordo || "Produto",
          periodoAcordo: dados.periodoAcordo || "Período",
          ultimaMensagem: dados.ultimaMensagem || "",
          naoLidas: dados.naoLidas?.[usuarioLogadoId] || 0,
          idLocador: dados.idLocador || "",
          idLocatario: dados.idLocatario || "",
        } as Conversa;
      });

      setConversas(listaSalas);

      if (!conversaAtiva) {
        if (idParam) {
          const target = listaSalas.find((c) => c.id === idParam);
          if (target) setConversaAtiva(target);
        } else if (listaSalas.length > 0) {
          setConversaAtiva(listaSalas[0]);
        }
      }
    });

    return () => unsubscribe();
  }, [conversaAtiva, idParam, usuarioLogadoId]);

  useEffect(() => {
    if (!conversaAtiva) return;

    const caminhoColecao = collection(
      dbFirebase,
      "conversas",
      conversaAtiva.id,
      "mensagens",
    );
    const consultaFiltrada = query(caminhoColecao, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(consultaFiltrada, (snapshot) => {
      const batch = writeBatch(dbFirebase);
      let possuiNaoLida = false;

      const listaMensagens = snapshot.docs.map((snapshotDoc) => {
        const dados = snapshotDoc.data();
        let horaFormatada = "";
        if (dados.timestamp) {
          horaFormatada = dados.timestamp
            .toDate()
            .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        }

        if (dados.remetenteId !== usuarioLogadoId && dados.lida === false) {
          const mRef = doc(
            dbFirebase,
            "conversas",
            conversaAtiva.id,
            "mensagens",
            snapshotDoc.id,
          );
          batch.update(mRef, { lida: true });
          possuiNaoLida = true;
        }

        return {
          id: snapshotDoc.id,
          texto: dados.texto,
          remetenteId: dados.remetenteId,
          timestamp: horaFormatada,
          lida: dados.lida,
        } as Mensagem;
      });

      if (possuiNaoLida) {
        batch.commit().catch((err) =>
          console.error("Erro ao marcar mensagens como lidas:", err),
        );
        updateDoc(doc(dbFirebase, "conversas", conversaAtiva.id), {
          [`naoLidas.${usuarioLogadoId}`]: 0,
        }).catch(() => {});
      }

      setMensagens(listaMensagens);
    });

    return () => unsubscribe();
  }, [conversaAtiva, usuarioLogadoId]);

  const abrirConversa = async (c: Conversa) => {
    setConversaAtiva(c);
    if (c.naoLidas > 0) {
      await updateDoc(doc(dbFirebase, "conversas", c.id), {
        [`naoLidas.${usuarioLogadoId}`]: 0,
      }).catch(() => {});
    }
  };

  const onEnviarMensagemSubmit = async (data: ChatFormValues) => {
    if (!conversaAtiva || !data.mensagemTexto.trim()) return;
    const textoParaEnviar = data.mensagemTexto;
    reset({ ...data, mensagemTexto: "" });

    try {
      const outroUserId =
        conversaAtiva.idLocatario === usuarioLogadoId
          ? conversaAtiva.idLocador
          : conversaAtiva.idLocatario;

      await addDoc(
        collection(dbFirebase, "conversas", conversaAtiva.id, "mensagens"),
        {
          texto: textoParaEnviar,
          remetenteId: usuarioLogadoId,
          timestamp: serverTimestamp(),
          lida: false,
        },
      );

      await updateDoc(doc(dbFirebase, "conversas", conversaAtiva.id), {
        ultimaMensagem: textoParaEnviar,
        ultimaMensagemAt: serverTimestamp(),
        [`naoLidas.${outroUserId}`]: increment(1),
      });
    } catch (error) {
      console.error("Erro ao enviar:", error);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-80px)] flex bg-white font-sans text-[#1a1a1a] min-h-0">
      <aside className="w-80 border-r border-gray-100 flex flex-col justify-between p-6 shrink-0 h-full">
        <div className="space-y-1 overflow-y-auto flex-1">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-black transition text-sm font-medium mb-4"
          >
            <ChevronLeft size={18} /> Voltar
          </button>

          {conversasFiltradas.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-6">
              Nenhuma conversa encontrada.
            </p>
          )}

          {conversasFiltradas.map((c) => (
            <button
              key={c.id}
              onClick={() => abrirConversa(c)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                conversaAtiva?.id === c.id
                  ? "bg-gray-100 font-bold"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
              <div className="flex-1 truncate text-left">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-900 font-semibold truncate">
                    {c.nomeUsuario}
                  </p>
                  {c.naoLidas > 0 && (
                    <span className="ml-2 shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {c.naoLidas > 9 ? "9+" : c.naoLidas}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">{c.itemAcordo}</p>
                {c.ultimaMensagem && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {c.ultimaMensagem}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="relative mt-4 pt-2 border-t border-gray-100">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Controller
            name="buscaConversa"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Procurar conversa..."
                className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none text-gray-700"
              />
            )}
          />
        </div>
      </aside>

      <section className="flex-1 flex flex-col bg-white">
        {conversaAtiva ? (
          <>
            <div className="px-8 py-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div>
                <p className="font-bold text-gray-900">
                  {conversaAtiva.nomeUsuario}
                </p>
                <p className="text-xs text-gray-400">
                  {conversaAtiva.itemAcordo} · {conversaAtiva.periodoAcordo}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              {mensagens.map((m) => {
                const ehMinha = m.remetenteId === usuarioLogadoId;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${ehMinha ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-end gap-2 max-w-[70%]">
                      {!ehMinha && (
                        <div className="w-7 h-7 bg-gray-200 rounded-full shrink-0 mb-1" />
                      )}
                      <div
                        className={`rounded-[22px] px-5 py-3 text-sm ${
                          ehMinha
                            ? "bg-gray-200 rounded-tr-sm"
                            : "bg-gray-100 rounded-tl-sm"
                        }`}
                      >
                        {m.texto}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-300 font-bold mt-1 px-9">
                      {m.timestamp}
                    </span>
                  </div>
                );
              })}
              <div ref={mensagensEndRef} />
            </div>

            <form
              onSubmit={handleSubmit(onEnviarMensagemSubmit)}
              className="p-6 border-t border-gray-100 flex items-center gap-4"
            >
              <Controller
                name="mensagemTexto"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-[#f8f9fa] rounded-full px-6 py-3 text-sm outline-none"
                  />
                )}
              />
              <button
                type="submit"
                className="p-3 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-full transition text-gray-500"
              >
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Selecione uma conversa.
          </div>
        )}
      </section>
    </div>
  );
}

export default function ChatsPage() {
  return (
    <Suspense>
      <ChatsContent />
    </Suspense>
  );
}
