"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { ToastContainer } from "react-toastify";

type ProvidersProps = {
  className?: string;
  children: ReactNode;
};

export const queryClient = new QueryClient();

const Providers: React.FC<ProvidersProps> = ({ className, children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

export default Providers;
