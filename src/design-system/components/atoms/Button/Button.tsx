/**
 * Figma: "Bttn inicio" (2:128) · "Grupo 45" / Salir (13:156) · "Grupo 45" ✕ (476:4928)
 *        · "Grupo 82" ✓ (138:2566) · "Botones" de menú (618:12565, Disabled 618:12568)
 * URL: https://www.figma.com/design/GWE1jyD5ZyUbvLUsk6pVkx/?node-id=2-128
 * Última sincronización: 2026-10-28
 */
import type { ButtonHTMLAttributes } from 'react';
import crossSmall from '../../../../assets/icons/cross-small.svg';
import checkmarkRound from '../../../../assets/icons/checkmark-round.svg';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'success';
}

export function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  return <button type="button" className={`ds-button ds-button--${variant} ${className}`} {...rest} />;
}

/** Botón rojo con ✕ de los modales. */
export function CancelButton(props: Omit<ButtonProps, 'variant' | 'children'>) {
  return (
    <Button variant="danger" aria-label="Cancelar" {...props}>
      <img src={crossSmall} alt="" width={24.028} height={27.486} />
    </Button>
  );
}

/** Botón verde con ✓ de los modales (gris cuando está deshabilitado). */
export function ConfirmButton(props: Omit<ButtonProps, 'variant' | 'children'>) {
  return (
    <Button variant="success" aria-label="Confirmar" {...props}>
      <img src={checkmarkRound} alt="" width={31.012} height={32.72} />
    </Button>
  );
}
