// lib/hooks/useLogin.ts
import { useState } from "react";
import { signIn } from "next-auth/react";

type LoginCredentials = {
  username: string;
  password: string;
};

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    
    try {
      const result = await signIn("credentials", {
        username: credentials.username,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};