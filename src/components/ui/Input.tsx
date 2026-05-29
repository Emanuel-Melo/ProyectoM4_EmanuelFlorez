import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, id, ...rest }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <label className="input__label" htmlFor={inputId}>
      {label && <span className="input__title">{label}</span>}
      <input id={inputId} className="input" {...rest} />
    </label>
  );
}
