/**
 * Figma: "INPUT PRUEBA" (2:131) · "CONTRASEÑAPRUEBA" (2:139) · "SELECT CEDIS" (2:148)
 * URL: https://www.figma.com/design/GWE1jyD5ZyUbvLUsk6pVkx/?node-id=2-130
 * Última sincronización: 2026-10-28
 */
import type { ReactNode } from 'react';
import dropdownIcon from '../../../../assets/icons/dropdown.svg';
import './Field.css';

interface FieldFrameProps {
  label?: string;
  icon: ReactNode;
  /** Padding izquierdo y gap entre ícono y texto, tal como en cada instancia de Figma. */
  paddingLeft: number;
  gap: number;
  children: ReactNode;
  trailing?: ReactNode;
}

function FieldFrame({ label, icon, paddingLeft, gap, children, trailing }: FieldFrameProps) {
  return (
    <label className="ds-field" style={{ paddingLeft, gap }}>
      {icon}
      {children}
      {label && <span className="ds-field__label">{label}</span>}
      {trailing}
    </label>
  );
}

interface TextFieldProps {
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'password';
  inputMode?: 'numeric' | 'text';
  paddingLeft: number;
  gap: number;
  fontSize: number;
  trailing?: ReactNode;
  autoComplete?: string;
}

export function TextField({ value, onChange, type = 'text', inputMode, fontSize, autoComplete, ...frame }: TextFieldProps) {
  return (
    <FieldFrame {...frame}>
      <input
        className="ds-field__input"
        style={{ fontSize }}
        type={type}
        inputMode={inputMode}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldFrame>
  );
}

interface SelectFieldProps {
  icon: ReactNode;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  ariaLabel: string;
  /** Texto cuando no hay opción elegida ("Seleccionar una opción", 275:3986). */
  placeholder?: string;
  paddingLeft?: number;
  gap?: number;
}

export function SelectField({ icon, value, options, onChange, ariaLabel, placeholder, paddingLeft = 13, gap = 11 }: SelectFieldProps) {
  return (
    <FieldFrame
      icon={icon}
      paddingLeft={paddingLeft}
      gap={gap}
      trailing={
        <span className="ds-field__dropdown">
          <span className="ds-field__dropdown-inner">
            <img src={dropdownIcon} alt="" />
          </span>
        </span>
      }
    >
      <span className="ds-field__value">{value || placeholder}</span>
      <select className="ds-field__select" aria-label={ariaLabel} value={value} onChange={(e) => onChange(e.target.value)}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldFrame>
  );
}
