import type { FormEvent } from "react";
import "./LoginForm.css";

type LoginFormProps = {
  email: string;
  password: string;
  remember: boolean;
  error: string | null;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRememberChange: (checked: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onGoogleLogin: () => void;
};

export default function LoginForm({
  email,
  password,
  remember,
  error,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onRememberChange,
  onSubmit,
  onGoogleLogin,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="auth-form">
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
            placeholder="••••••••••••"
            autoComplete="current-password"
            onChange={(e) => onPasswordChange(e.target.value)}
            required
          />
          <span className="auth-field__peek" aria-hidden="true">
            ◉
          </span>
        </span>
      </label>

      <div className="auth-form__row">
        <label className="auth-check">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => onRememberChange(e.target.checked)}
          />
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
