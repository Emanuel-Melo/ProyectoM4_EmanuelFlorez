import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../services/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthCtx() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthCtx must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Manejar el resultado de signInWithRedirect cuando el flujo usa redirección
  useEffect(() => {
    let mounted = true;
    async function handleRedirectResult() {
      try {
        const result = await getRedirectResult(auth);
        if (!mounted) return;
        if (result && result.user) {
          setUser(result.user);
        }
      } catch (err) {
        // Loguear para diagnóstico y permitir que la UI lo capture si es necesario
        // No lanzamos para no romper el ciclo de montaje
        // eslint-disable-next-line no-console
        console.warn("Auth redirect result error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    handleRedirectResult();

    return () => {
      mounted = false;
    };
  }, []);

  async function register(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      const authError = error as { code?: string };

      if (authError.code === "auth/unauthorized-domain") {
        // eslint-disable-next-line no-console
        console.error(
          "Firebase auth unauthorized domain:",
          window.location.origin,
          "- Verifica que este dominio esté autorizado en Firebase Auth."
        );
        throw error;
      }

      if (
        authError.code === "auth/popup-blocked" ||
        authError.code === "auth/cancelled-popup-request" ||
        authError.code === "auth/operation-not-supported-in-this-environment"
      ) {
        await signInWithRedirect(auth, provider);
        return;
      }
      throw error;
    }
  }

  async function logout() {
    await signOut(auth);
  }

  const value: AuthContextValue = { user, loading, register, login, loginWithGoogle, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
