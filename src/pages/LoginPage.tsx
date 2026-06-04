import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import writtenLogo from "../Orion task/Escrito orion task.png";
import centerLogo from "../Orion task/Logo sin fondo orion task.png";
import { useAuthCtx } from "../context/AuthContext";
import { getFirebaseAuthErrorMessage } from "../utils/firebaseErrors";
import LoginForm from "../components/auth/LoginForm";
import "./LoginPage.css";

function getErrorMessage(error: unknown, fallback: string) {
  return getFirebaseAuthErrorMessage(error, fallback);
}

export default function LoginPage() {
  const { user, login, loginWithGoogle } = useAuthCtx();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

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
    <main className="auth-shell">
      <section className="auth-panel auth-panel--login" aria-label="Iniciar sesion">
        <header className="auth-panel__top">
          <Link to="/" className="auth-panel__back">
            ← Volver al inicio
          </Link>
          <img className="auth-panel__logo" src={writtenLogo} alt="Orion Task" />
          <div className="auth-panel__status">
            <span>Status</span>
            <strong>Online ●</strong>
          </div>
        </header>

        <div className="auth-panel__system" aria-hidden="true">
          <span>SYS-01</span>
          <span>Auth module</span>
          <span>Secure access</span>
          <span>Ver. 1.0.0</span>
        </div>

        <img className="auth-panel__mark" src={centerLogo} alt="" aria-hidden="true" />

        <div className="auth-panel__heading">
          <h1>Iniciar sesion</h1>
          <p>Accede al centro de mando</p>
        </div>

        <LoginForm
          email={email}
          password={password}
          remember={remember}
          error={error}
          isLoading={isLoading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onRememberChange={setRemember}
          onSubmit={handleSubmit}
          onGoogleLogin={handleGoogleLogin}
        />

        <footer className="auth-panel__footer">
          <span>¿No tienes una cuenta?</span>
          <Link to="/register">Registrarse</Link>
        </footer>
      </section>
    </main>
  );
}
