"use client";

import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[350px] relative">
        
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500"
        >
          ✕
        </button>

        <h1 className="text-center text-2xl font-bold mb-2">BORROW</h1>
        <hr className="mb-4" />

        <h2 className="text-lg font-semibold mb-4">
          Acesse sua conta
        </h2>

        <form className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="E-mail ou CPF"
            className="border p-2 rounded"
          />

          <input
            type="password"
            placeholder="Senha"
            className="border p-2 rounded"
          />

          <button className="bg-gray-300 py-2 rounded">
            Entrar
          </button>
        </form>

        <div className="text-sm text-center mt-3 text-gray-500">
          <p>Esqueceu a senha?</p>
          <p>
            Não possui uma conta? <span className="underline">Cadastrar-se</span>
          </p>
        </div>
      </div>
    </div>
  );
}