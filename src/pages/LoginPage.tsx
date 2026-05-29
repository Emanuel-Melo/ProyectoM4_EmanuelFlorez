import React, { useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuthCtx } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuthCtx();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
  }

  return (
    <main className="page page--auth">
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className="form">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="form__error">{error}</p>}
        <Button type="submit">Entrar</Button>
      </form>
      <div className="auth__actions">
        <Button onClick={() => loginWithGoogle()}>Entrar con Google</Button>
        <Link to="/register">Crear cuenta</Link>
      </div>
    </main>
  );
}
