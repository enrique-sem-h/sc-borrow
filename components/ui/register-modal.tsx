"use client";

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
    telefone: z.string().min(1),
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

function FieldError({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p className="text-red-500 text-xs mt-1 ml-1">
      Por favor, preencha todos os campos obrigatórios
    </p>
  );
}

export default function RegisterModal({
  isOpen,
  onClose,
  onLogin,
  onSuccess,
}: RegisterModalProps) {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitted },
  } = useForm<FormType>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      uf: "DF",
      bairro: "",
    },
  });

  if (!isOpen) return null;

  function maskTelefone(value: string): string {
    const d = value.replace(/\D/g, "").slice(0, 11);
    if (d.length > 10) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length > 6) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 0) return `(${d}`;
    return d;
  }

  function maskCpf(value: string): string {
    const d = value.replace(/\D/g, "").slice(0, 11);
    if (d.length > 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
    if (d.length > 6) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    if (d.length > 3) return `${d.slice(0, 3)}.${d.slice(3)}`;
    return d;
  }

  function maskCep(value: string): string {
    const d = value.replace(/\D/g, "").slice(0, 8);
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
  }

  function handleNumeroChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    const parsed = parseInt(digits, 10);
    setValue("numero", isNaN(parsed) || parsed <= 0 ? 0 : parsed);
  }

  const onFormSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        telefone: data.telefone.replace(/\D/g, ""),
        cpf: data.cpf.replace(/\D/g, ""),
        cep: data.cep.replace(/\D/g, ""),
      };
      await apiService.register(payload);
      onSuccess();
    } catch (error) {
      console.log(error);
    }
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
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label required>Nome Completo</Label>
              <Controller
                name="nome"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <FormInput placeholder="Nome Completo" {...field} />
                    <FieldError show={!!fieldState.error && isSubmitted} />
                  </>
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label required>Telefone</Label>
              <Controller
                name="telefone"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <FormInput
                      placeholder="(xx) xxxxx-xxxx"
                      {...field}
                      onChange={(e) => field.onChange(maskTelefone(e.target.value))}
                    />
                    <FieldError show={!!fieldState.error && isSubmitted} />
                  </>
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label required>Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <FormInput placeholder="Email" {...field} />
                    <FieldError show={!!fieldState.error && isSubmitted} />
                  </>
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label required>CPF</Label>
              <Controller
                name="cpf"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <FormInput
                      placeholder="xxx.xxx.xxx-xx"
                      {...field}
                      onChange={(e) => field.onChange(maskCpf(e.target.value))}
                    />
                    <FieldError show={!!fieldState.error && isSubmitted} />
                  </>
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label required>Senha</Label>
              <Controller
                name="senha"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <FormInput placeholder="Senha" type="password" {...field} />
                    <FieldError show={!!fieldState.error && isSubmitted} />
                  </>
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label required>Confirmar Senha</Label>
              <Controller
                name="confirmarSenha"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <FormInput
                      placeholder="Confirmar Senha"
                      type="password"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  </>
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
                render={({ field, fieldState }) => (
                  <>
                    <FormInput
                      placeholder="xxxxx-xxx"
                      {...field}
                      onChange={(e) => field.onChange(maskCep(e.target.value))}
                    />
                    <FieldError show={!!fieldState.error && isSubmitted} />
                  </>
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
                render={({ field, fieldState }) => (
                  <>
                    <FormInput placeholder="Logradouro" {...field} />
                    <FieldError show={!!fieldState.error && isSubmitted} />
                  </>
                )}
              />
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <Label required>Bairro</Label>
              <Controller
                name="bairro"
                control={control}
                render={({ field, fieldState }) => (
                  <>
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
                    <FieldError show={!!fieldState.error && isSubmitted} />
                  </>
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label required>Número</Label>
              <Controller
                name="numero"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <FormInput
                      placeholder="Número"
                      type="number"
                      {...field}
                      onChange={(e) => {
                        handleNumeroChange(e);
                        field.onChange(e);
                      }}
                    />
                    <FieldError show={!!fieldState.error && isSubmitted} />
                  </>
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
