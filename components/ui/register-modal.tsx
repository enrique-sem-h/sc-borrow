"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "./input";

const BAIRROS_DF = [
  "Águas Claras",
  "Arniqueira",
  "Brasília (Plano Piloto)",
  "Brazlândia",
  "Candangolândia",
  "Ceilândia",
  "Cruzeiro",
  "Fercal",
  "Gama",
  "Guará",
  "Itapoã",
  "Jardim Botânico",
  "Lago Norte",
  "Lago Sul",
  "Núcleo Bandeirante",
  "Park Way",
  "Paranoá",
  "Planaltina",
  "Recanto das Emas",
  "Riacho Fundo",
  "Riacho Fundo II",
  "Samambaia",
  "Santa Maria",
  "São Sebastião",
  "SCIA / Estrutural",
  "SIA",
  "Sobradinho",
  "Sobradinho II",
  "Sol Nascente / Pôr do Sol",
  "Sudoeste / Octogonal",
  "Taguatinga",
  "Varjão",
  "Vicente Pires",
];

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  onLogin,
}: RegisterModalProps) {
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    setCep(digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits);
  }

  function handleNumeroChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    const parsed = parseInt(digits, 10);
    setNumero(isNaN(parsed) || parsed <= 0 ? "" : String(parsed));
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[520px] rounded-[30px] px-8 py-6 relative shadow-xl max-h-[90vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-3xl text-gray-500 hover:text-black transition"
        >
          ✕
        </button>

        <h1 className="text-center text-4xl font-['Shrikhand'] tracking-tight">
          BORROW
        </h1>

        <div className="border-b mt-5 mb-7" />

        <h2 className="text-3xl font-bold mb-7 text-center">
          Crie sua conta
        </h2>

        <form className="flex flex-col gap-5">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input placeholder="Nome Completo" name="name" />
            <Input placeholder="Telefone" name="phone" />
            <Input placeholder="Email" type="email" name="email" />
            <Input placeholder="CPF" name="cpf" />
            <Input placeholder="Senha" type="password" name="password" />
            <Input placeholder="Confirmar Senha" type="password" name="confirm-password" />
          </div>

          <div className="border-b border-gray-100" />

          <div className="grid grid-cols-2 gap-4">

            <Input
              placeholder="CEP"
              name="cep"
              value={cep}
              onChange={handleCepChange}
              inputMode="numeric"
            />

            <Input
              name="uf"
              value="DF"
              readOnly
              className="bg-gray-100 text-gray-500 cursor-not-allowed"
            />

            <Input
              placeholder="Logradouro"
              name="logradouro"
              className="col-span-2"
            />

            <select
              name="bairro"
              defaultValue=""
              className="col-span-2 border-2 rounded-xl px-5 py-3 text-lg outline-none text-gray-700 focus:border-gray-400 transition bg-white"
            >
              <option value="" disabled>Bairro</option>
              {BAIRROS_DF.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <Input
              placeholder="Número"
              name="numero"
              inputMode="numeric"
              value={numero}
              onChange={handleNumeroChange}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />

            <Input
              placeholder="Complemento (opcional)"
              name="complemento"
            />

          </div>

          <button
            className="bg-gray-300 hover:bg-gray-400 transition rounded-xl py-3 text-2xl font-semibold mt-2"
          >
            Cadastrar-se
          </button>

        </form>

        <div className="text-center mt-6 text-gray-500">
          <p className="text-base">
            Já possui conta?{" "}
            <button
              onClick={onLogin}
              className="underline hover:text-black transition"
            >
              Login
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
