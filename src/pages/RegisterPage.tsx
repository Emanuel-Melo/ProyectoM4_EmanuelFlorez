import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import writtenLogo from "../Orion task/Escrito orion task.png";
import centerLogo from "../Orion task/Logo sin fondo orion task.png";
import { useAuthCtx } from "../context/AuthContext";
import { getFirebaseAuthErrorMessage } from "../utils/firebaseErrors";
import RegisterForm from "../components/auth/RegisterForm";
import "./LoginPage.css";
import "./RegisterPage.css";

function getErrorMessage(error: unknown, fallback: string) {
  return getFirebaseAuthErrorMessage(error, fallback);
}

export default function RegisterPage() {
  const { user, register, loginWithGoogle } = useAuthCtx();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
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

        <RegisterForm
          fullName={fullName}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          acceptTerms={acceptTerms}
          error={error}
          isLoading={isLoading}
          onFullNameChange={setFullName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onAcceptTermsChange={setAcceptTerms}
          onSubmit={handleSubmit}
          onGoogleLogin={handleGoogleLogin}
        />

        <footer className="auth-panel__footer">
          <span>¿Ya tienes una cuenta?</span>
          <Link to="/login">Iniciar sesion</Link>
        </footer>
      </section>
    </main>
  );
}
