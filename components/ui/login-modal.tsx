"use client";

import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import FormInput from "./form-input";
import { UsuarioInsert } from "@/infra/database/schemas/usuariosSchema";
import { insertUserSchema } from "@/modules/zod/schemas/usuarioSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import apiService from "@/services/api";
import { login } from "@/actions/login";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
  onLoginSuccess: () => void;
}

type FormType = Pick<UsuarioInsert, "email" | "senha">;

const schema = insertUserSchema.pick({
  email: true,
  senha: true,
});

export default function LoginModal({
  isOpen,
  onClose,
  onRegisterClick,
  onLoginSuccess,
}: LoginModalProps) {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const authContext = useAuth();
  const { login } = authContext;

  if (!isOpen) return null;

  const onRegisterBtnClick = () => {
    onRegisterClick();
  };

  const onFormSubmit: SubmitHandler<FormType> = async (data) => {
    try {
      const response = await login(data);

      toast("Login efetuado com sucesso!", {});

      setTimeout(() => {
        onLoginSuccess();
      }, 3000);
    } catch (error) {
      toast("Email ou senha incorretos", {
        type: "error",
      });
    }
  };

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

        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <FormInput
                  placeholder="Email"
                  error={fieldState.error?.message}
                  {...field}
                />
              );
            }}
          />

          <Controller
            name="senha"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <FormInput
                  placeholder="Senha"
                  error={fieldState.error?.message}
                  {...field}
                  type="password"
                />
              );
            }}
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
