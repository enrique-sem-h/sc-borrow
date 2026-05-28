"use server";

import { UsuarioLogin } from "@/infra/database/schemas/usuariosSchema";
import apiService from "@/services/api";
import { cookies } from "next/headers";

export async function login(data: UsuarioLogin) {
  const response = await apiService.login(data);

  return response.data;
}
