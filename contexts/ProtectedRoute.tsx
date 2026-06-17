import { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoadingUser, isAuth } = useAuth()!;
  const router = useRouter();
  if (isLoadingUser) {
    return null;
  }

  if (!isAuth) {
    router.replace("/");

    return null;
  }

  return children;
};

export default ProtectedRoute;
