"use client";

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {deleteCookie, getCookie, setCookie} from "cookies-next";
import $api from "@/http";
import AuthService from "@/service/authService";
import {IAuthContextType, IAuthResponse, IRegistrationResponse} from "@/types/types";

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data: IAuthResponse = await AuthService.login(email, password);

      setCookie("token", data.accessToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 15,
      });

      $api.setAuthToken(data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      setIsAuth(true);

      router.push("/auth");
    } catch (e: any) {

      console.error("Login error:", e.userMessage || e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // @ts-ignore
  const registration = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    birthday?: string,
    gender?: string
  ): Promise<IRegistrationResponse> => {
    setIsLoading(true);
    try {
      const result =  await AuthService.registration(
        email,
        password,
        firstName,
        lastName,
        birthday,
        gender
      );

      setCookie("token", result.accessToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 15,
      });

      $api.setAuthToken(result.accessToken);
      localStorage.setItem("user", JSON.stringify(result.user));

      setUser(result.user);
      setIsAuth(true);

      router.push("/auth");
    } catch (e: any) {
      console.error("Registration error:", e.userMessage || e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };


  const verifyUser = async (token: string) => {
    try {
      const result = await AuthService.verifyEmail(token);

      if (result.accessToken) {
        setCookie("token", result.accessToken, {
          path: "/",
          maxAge: 60 * 60 * 24 * 15,
        });

        $api.setAuthToken(result.accessToken);
        localStorage.setItem("user", JSON.stringify(result.user));

        setUser(result.user);
        setIsAuth(true);

        router.push("/auth");
      } else {
        console.log("err: no access token in response");
      }
    } catch (e: any) {
      console.log("verify error:", e.message);
    }
  };


  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();

      deleteCookie("token", { path: "/" });
      localStorage.removeItem("user");

      $api.clearAuthToken();

      setUser(null);
      setIsAuth(false);

      router.push("/login");
      console.log("44444")
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const token = getCookie("token");
      if (!token) throw new Error("No token found");

      $api.setAuthToken(token as string);

      const data = await AuthService.verify();
      if (!data.user) throw new Error("No user data");

      setUser(data.user);
      setIsAuth(true);
    } catch (e: any) {
      console.log("Check auth error:", e.message);
      setUser(null);
      setIsAuth(false);
      router.push("/login");
      console.log("55555")
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuth, login, registration, verifyUser, logout, checkAuth, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
