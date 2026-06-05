"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { dbFirebase } from "@/infra/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { collectionGroup } from "firebase/firestore";

interface NotificationContextType {
  chatCount: number;
  aluguelCount: number;
  anuncioCount: number; 
}

const NotificationContext = createContext<NotificationContextType>({
  chatCount: 0,
  aluguelCount: 0,
  anuncioCount: 0,
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [chatCount, setChatCount] = useState(0);
  const [aluguelCount, setAluguelCount] = useState(0);
  const [anuncioCount, setAnuncioCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    const qChats = query(
      collectionGroup(dbFirebase, "mensagens")
    );
    
    const unsubChats = onSnapshot(qChats, (snapshot) => {
      setChatCount(snapshot.size);
    });

    const qAlugueis = query(collection(dbFirebase, "alugueis"), where("dono", "==", user.id), where("status", "==", "pendente"));
    const unsubAlugueis = onSnapshot(qAlugueis, (s) => setAluguelCount(s.size));

    const qAnuncios = query(collection(dbFirebase, "anuncios"), where("dono", "==", user.id), where("status", "==", "ativo"));
    const unsubAnuncios = onSnapshot(qAnuncios, (s) => setAnuncioCount(s.size));

    return () => { unsubChats(); unsubAlugueis(); unsubAnuncios(); };
  }, [user?.id]);

  return (
    <NotificationContext.Provider value={{ chatCount, aluguelCount, anuncioCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);