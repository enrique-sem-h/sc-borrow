"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { ReactNode } from "react";

type DashboardMeusDadosPageProps = {
  className?: string;
  children: ReactNode;
};

const Campo = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="block text-base font-bold text-gray-900 mb-2">
      {label}
    </label>
    <div className="w-full border-2 rounded-xl px-5 py-3 text-lg text-gray-600 bg-gray-50 border-gray-200">
      {value || "—"}
    </div>
  </div>
);

const DashboardMeusDadosPage: React.FC<DashboardMeusDadosPageProps> = ({
  className,
  children,
}) => {
  const auth = useAuth();
  const user = auth?.user;

  return (
    <>
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
        Meus dados
      </h1>
      <div className="border-t border-gray-300 mb-8" />

      <div className="space-y-6">
        <Campo label="Nome completo:" value={user?.nome ?? ""} />

        <div className="grid grid-cols-2 gap-6">
          <Campo label="CPF:" value={user?.cpf ?? ""} />
          <Campo label="E-mail:" value={user?.email ?? ""} />
        </div>

        <Campo label="Celular:" value={user?.telefone ?? ""} />

        <div>
          <label className="block text-base font-bold text-gray-900 mb-2">
            Endereço:
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Campo label="CEP:" value={user?.cep ?? ""} />
            <Campo label="UF:" value={user?.uf ?? ""} />
            <div className="col-span-2">
              <Campo label="Logradouro:" value={user?.logradouro ?? ""} />
            </div>
            <div className="col-span-2">
              <Campo label="Bairro:" value={user?.bairro ?? ""} />
            </div>
            <Campo
              label="Número:"
              value={user?.numero ? String(user.numero) : ""}
            />
            <Campo label="Complemento:" value={user?.complemento ?? ""} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardMeusDadosPage;
