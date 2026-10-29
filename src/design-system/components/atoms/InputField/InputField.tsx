/**
 * Figma: "INPUT IP DE IMPRESORA" (593:11547; instancia 730:5600) — estados Activo, Focus, Lleno, Error, Inactivo.
 * Se reutiliza para la paquetería no registrada, el comentario del motivo "Otros" y el selector de fecha
 * (sin respaldo en Figma para esos usos).
 * Última sincronización: 2026-10-29
 */
import { forwardRef } from 'react';
import './InputField.css';

interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  maxLength?: number;
  /** Muestra "n/máx" bajo el campo. */
  contador?: boolean;
  multiline?: boolean;
  type?: 'text' | 'date';
  inputMode?: 'text' | 'decimal' | 'numeric';
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const InputField = forwardRef<HTMLInputElement & HTMLTextAreaElement, InputFieldProps>(function InputField(
  { value, onChange, ariaLabel, placeholder, maxLength, contador, multiline, type = 'text', inputMode, error, disabled, autoFocus },
  ref,
) {
  const clase = `ds-input${multiline ? ' ds-input--multiline' : ''}${error ? ' ds-input--error' : ''}`;
  const comunes = {
    className: clase,
    'aria-label': ariaLabel,
    'aria-invalid': error || undefined,
    placeholder,
    maxLength,
    disabled,
    autoFocus,
    value,
  };
  return (
    <div className="ds-input-wrap">
      {multiline ? (
        <textarea ref={ref} {...comunes} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input ref={ref} type={type} inputMode={inputMode} autoComplete="off" {...comunes} onChange={(e) => onChange(e.target.value)} />
      )}
      {contador && maxLength && (
        <p className="ds-input__contador" aria-live="polite">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
});
