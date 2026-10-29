/**
 * Figma: enlace "EDITAR ✎" / "LISTO" (730:6551 / 730:6772) y "Buscar de nuevo ⟳" (730:5187).
 * Última sincronización: 2026-10-29
 */
import type { ButtonHTMLAttributes } from 'react';
import './TextLink.css';

interface TextLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  /** "accent": azul en mayúsculas (EDITAR); "plain": negro (Buscar de nuevo). */
  tone?: 'accent' | 'plain';
}

export function TextLink({ icon, tone = 'accent', className = '', children, ...rest }: TextLinkProps) {
  return (
    <button type="button" className={`ds-text-link ds-text-link--${tone} ${className}`} {...rest}>
      <span>{children}</span>
      {icon && <img src={icon} alt="" width={20} height={20} />}
    </button>
  );
}
