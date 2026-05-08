"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "./input";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  onLogin
}: RegisterModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const onLoginClick =() => {
    onLogin()
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

      <div className="bg-white w-[520px] rounded-[30px] px-8 py-6 relative shadow-xl">

        <button
          onClick={onClose}
          className="
            absolute
            top-5
            right-6
            text-3xl
            text-gray-500
            hover:text-black
            transition
          "
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
            <Input placeholder="Endereço" name="address" className="col-span-2"  />
          </div>

          <button
            className="
              bg-gray-300
              hover:bg-gray-400
              transition
              rounded-xl
              py-3
              text-2xl
              font-semibold
              mt-2
            "
          >
           Cadastrar-se
          </button>
        </form>

        <div className="text-center mt-6 text-gray-500">

          <p className="text-base">
           Já possui conta?{" "}

            <button
            onClick={onLoginClick}
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
