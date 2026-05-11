"use client";

import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onRegisterClick
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const onRegisterBtnClick = () => {
    onRegisterClick()
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
          Acesse sua conta
        </h2>

        <form className="flex flex-col gap-5">

          <input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              border-2
              rounded-xl
              px-5
              py-3
              text-lg
              outline-none
              text-gray-700
              placeholder:text-gray-400
              focus:border-gray-400
              transition
            "
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              border-2
              rounded-xl
              px-5
              py-3
              text-lg
              outline-none
              text-gray-700
              placeholder:text-gray-400
              focus:border-gray-400
              transition
            "
          />

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
            Entrar
          </button>
        </form>

        <div className="text-center mt-6 text-gray-500">

          <p className="text-base mb-2 cursor-pointer hover:text-black transition">
            Esqueceu a senha?
          </p>

          <p className="text-base">
            Não possui uma conta?{" "}

            <button
            onClick={onRegisterBtnClick}
              className="underline hover:text-black transition"
            >
              Cadastrar-se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
