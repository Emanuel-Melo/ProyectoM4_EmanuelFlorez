import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import writtenLogo from "../Orion task/Escrito orion task.png";
import centerLogo from "../Orion task/Logo sin fondo orion task.png";
import { useAuthCtx } from "../context/AuthContext";
import "./LoginPage.css";
import "./RegisterPage.css";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuthCtx();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden");
      return;
    }

    if (!acceptTerms) {
      setError("Debes aceptar los terminos y condiciones");
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Error al crear la cuenta"));
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
      <section className="auth-panel auth-panel--register" aria-label="Crear cuenta">
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
          <span>New user</span>
          <span>Ver. 1.0.0</span>
        </div>

        <img className="auth-panel__mark" src={centerLogo} alt="" aria-hidden="true" />

        <div className="auth-panel__heading">
          <h1>Crear cuenta</h1>
          <p>Unete al centro de mando</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span className="auth-field__label">Nombre completo</span>
            <span className="auth-field__control">
              <span className="auth-field__icon" aria-hidden="true">
                ♙
              </span>
              <input
                type="text"
                value={fullName}
                placeholder="Tu nombre completo"
                autoComplete="name"
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </span>
          </label>

          <label className="auth-field">
            <span className="auth-field__label">Correo electronico</span>
            <span className="auth-field__control">
              <span className="auth-field__icon" aria-hidden="true">
                ✉
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
                placeholder="Crea una contrasena segura"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="auth-field__peek" aria-hidden="true">
                ◉
              </span>
            </span>
          </label>

          <label className="auth-field">
            <span className="auth-field__label">Confirmar contrasena</span>
            <span className="auth-field__control">
              <span className="auth-field__icon" aria-hidden="true">
                ▣
              </span>
              <input
                type="password"
                value={confirmPassword}
                placeholder="Confirma tu contrasena"
                autoComplete="new-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span className="auth-field__peek" aria-hidden="true">
                ◉
              </span>
            </span>
          </label>

          <label className="auth-check auth-check--terms">
            <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
            <span />
            Acepto los <a href="#terms">terminos y condiciones</a>
          </label>

          {error && <p className="auth-form__error">{error}</p>}

          <button className="auth-submit" type="submit" disabled={isLoading}>
            Registrarse <span aria-hidden="true">›</span>
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
          <span>¿Ya tienes una cuenta?</span>
          <Link to="/login">Iniciar sesion</Link>
        </footer>
      </section>
    </main>
  );
}
