import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuthCtx } from "../context/AuthContext";
import "./LoginPage.css";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuthCtx();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Error al iniciar sesion"));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Error al iniciar con Google"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page page--auth">
      <h1>Iniciar sesion</h1>
      <form onSubmit={handleSubmit} className="form">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Contrasena" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="form__error">{error}</p>}
        <Button type="submit" disabled={isLoading}>
          Entrar
        </Button>
      </form>
      <div className="auth__actions">
        <Button type="button" onClick={handleGoogleLogin} disabled={isLoading}>
          Entrar con Google
        </Button>
        <Link to="/register">Crear cuenta</Link>
      </div>
    </main>
  );
}
