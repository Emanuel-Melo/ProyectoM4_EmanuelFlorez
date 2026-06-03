import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import writtenLogo from "../Orion task/Escrito orion task.png";
import centerLogo from "../Orion task/Logo sin fondo orion task.png";
import { useAuthCtx } from "../context/AuthContext";
import { getFirebaseAuthErrorMessage } from "../utils/firebaseErrors";
import "./LoginPage.css";

function getErrorMessage(error: unknown, fallback: string) {
  return getFirebaseAuthErrorMessage(error, fallback);
}

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuthCtx();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
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

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span className="auth-field__label">Correo electronico</span>
            <span className="auth-field__control">
              <span className="auth-field__icon" aria-hidden="true">
                ♙
              </span>
              <input
                type="email"
                value={email}
                placeholder="ejemplo@orion-task.com"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </span>
          </label>

          <label className="auth-field">
            <span className="auth-field__label">Contrasena</span>
            <span className="auth-field__control">
              <span className="auth-field__icon" aria-hidden="true">
                ▣
              </span>
              <input
                type="password"
                value={password}
                placeholder="••••••••••••"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="auth-field__peek" aria-hidden="true">
                ◉
              </span>
            </span>
          </label>

          <div className="auth-form__row">
            <label className="auth-check">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span />
              Recordarme
            </label>
            <a href="#forgot" className="auth-form__link">
              ¿Olvidaste tu contrasena?
            </a>
          </div>

          {error && <p className="auth-form__error">{error}</p>}

          <button className="auth-submit" type="submit" disabled={isLoading}>
            Ingresar <span aria-hidden="true">›</span>
          </button>
        </form>

        <div className="auth-divider">
          <span>O continua con</span>
        </div>

        <div className="auth-socials">
          <button type="button" className="auth-social" onClick={handleGoogleLogin} disabled={isLoading}>
            <span className="auth-social__google">G</span>
            Google
          </button>
          <button type="button" className="auth-social" disabled>
            <span>●</span>
            Github
          </button>
        </div>

        <footer className="auth-panel__footer">
          <span>¿No tienes una cuenta?</span>
          <Link to="/register">Registrarse</Link>
        </footer>
      </section>
    </main>
  );
}
