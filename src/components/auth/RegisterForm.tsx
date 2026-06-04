import type { FormEvent } from "react";
import "./RegisterForm.css";

type RegisterFormProps = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  error: string | null;
  isLoading: boolean;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onAcceptTermsChange: (checked: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onGoogleLogin: () => void;
};

export default function RegisterForm({
  fullName,
  email,
  password,
  confirmPassword,
  acceptTerms,
  error,
  isLoading,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onAcceptTermsChange,
  onSubmit,
  onGoogleLogin,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="auth-form">
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
            onChange={(e) => onFullNameChange(e.target.value)}
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
            onChange={(e) => onEmailChange(e.target.value)}
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
            onChange={(e) => onPasswordChange(e.target.value)}
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
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            required
          />
          <span className="auth-field__peek" aria-hidden="true">
            ◉
          </span>
        </span>
      </label>

      <label className="auth-check auth-check--terms">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => onAcceptTermsChange(e.target.checked)}
        />
        <span />
        Acepto los <a href="#terms">terminos y condiciones</a>
      </label>

      {error && <p className="auth-form__error">{error}</p>}

      <button className="auth-submit" type="submit" disabled={isLoading}>
        Registrarse <span aria-hidden="true">›</span>
      </button>

      <div className="auth-divider">
        <span>O continua con</span>
      </div>

      <div className="auth-socials">
        <button type="button" className="auth-social" onClick={onGoogleLogin} disabled={isLoading}>
          <span className="auth-social__google">G</span>
          Google
        </button>
      </div>
    </form>
  );
}
