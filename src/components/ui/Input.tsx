import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import "./Input.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, id, ...rest }: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <label className="input__label" htmlFor={inputId}>
      {label && <span className="input__title">{label}</span>}
      <input id={inputId} className="input" {...rest} />
    </label>
  );
}
