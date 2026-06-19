"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormInput from "./form-input";
import { UsuarioInsert } from "@/infra/database/schemas/usuariosSchema";
import { insertUserSchema } from "@/modules/zod/schemas/usuarioSchema";
import apiService from "@/services/api";

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
  onSuccess: () => void;
}

type FormType = UsuarioInsert & {
  confirmarSenha: string;
};

const schema = insertUserSchema
  .extend({
    confirmarSenha: z.string().min(0),
    numero: z.coerce.number(),
  })
  .refine(
    (data) => {
      return data.senha === data.confirmarSenha;
    },
    {
      message: "Senhas não condizem",
      path: ["confirmarSenha"],
    },
  );

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

export default function RegisterModal({
  isOpen,
  onClose,
  onLogin,
  onSuccess,
}: RegisterModalProps) {
  const [showRequiredError, setShowRequiredError] = useState(false);

  const { handleSubmit, control, setValue } = useForm<FormType>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      uf: "DF",
      bairro: "",
    },
  });

  if (!isOpen) return null;

  function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    setValue(
      "cep",
      digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits,
    );
  }

  function handleNumeroChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    const parsed = parseInt(digits, 10);
    setValue("numero", isNaN(parsed) || parsed <= 0 ? 0 : parsed);
  }

  const onFormSubmit = async (data: any) => {
    setShowRequiredError(false);
    try {
      await apiService.register(data);
      onSuccess();
    } catch (error) {
      console.log(error);
    }
  };

  const onInvalidSubmit = () => {
    setShowRequiredError(true);
  };

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

        <h2 className="text-3xl font-bold mb-7 text-center">Crie sua conta</h2>

        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(onFormSubmit, onInvalidSubmit)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label required>Nome Completo</Label>
              <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                  <FormInput placeholder="Nome Completo" {...field} />
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label required>Telefone</Label>
              <Controller
                name="telefone"
                control={control}
                render={({ field }) => (
                  <FormInput placeholder="Telefone" {...field} />
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label required>Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <FormInput placeholder="Email" {...field} />
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label required>CPF</Label>
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <FormInput placeholder="CPF" {...field} />
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label required>Senha</Label>
              <Controller
                name="senha"
                control={control}
                render={({ field }) => (
                  <FormInput placeholder="Senha" type="password" {...field} />
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label required>Confirmar Senha</Label>
              <Controller
                name="confirmarSenha"
                control={control}
                render={({ field, fieldState }) => (
                  <FormInput
                    placeholder="Confirmar Senha"
                    type="password"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          <div className="border-b border-gray-100" />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label required>CEP</Label>
              <Controller
                name="cep"
                control={control}
                render={({ field }) => (
                  <FormInput
                    placeholder="CEP"
                    {...field}
                    onChange={(e) => {
                      handleCepChange(e);
                      field.onChange(e);
                    }}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>UF</Label>
              <Controller
                name="uf"
                control={control}
                render={({ field }) => (
                  <FormInput placeholder="UF" readOnly {...field} value="DF" />
                )}
              />
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <Label required>Logradouro</Label>
              <Controller
                name="logradouro"
                control={control}
                render={({ field }) => (
                  <FormInput placeholder="Logradouro" {...field} />
                )}
              />
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <Label required>Bairro</Label>
              <Controller
                name="bairro"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="col-span-2 border-2 rounded-xl px-5 py-3 text-lg outline-none text-gray-700 focus:border-gray-400 transition bg-white"
                  >
                    <option value="" disabled>
                      Selecione o bairro
                    </option>
                    {BAIRROS_DF.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label required>Número</Label>
              <Controller
                name="numero"
                control={control}
                render={({ field }) => (
                  <FormInput
                    placeholder="Número"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      handleNumeroChange(e);
                      field.onChange(e);
                    }}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Complemento</Label>
              <Controller
                name="complemento"
                control={control}
                render={({ field }) => (
                  <FormInput
                    placeholder="Complemento (opcional)"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
            </div>
          </div>

          {showRequiredError && (
            <p className="text-red-500 text-sm text-center font-medium">
              Por favor, preencha todos os campos obrigatórios
            </p>
          )}

          <button className="bg-gray-300 hover:bg-gray-400 transition rounded-xl py-3 text-2xl font-semibold mt-2">
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
