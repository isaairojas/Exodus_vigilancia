/**
 * Figma: modales inferiores — "Modal embarque finalizado" (138:2557, 476:4921, 618:12192),
 *        "Modal shadow" (275:3425), "Modal seleccion 1 inact" (275:3795), "Modal Menu" (618:12559)
 *        + fondo "BG BLUR MODALES" (568:7713)
 *        + modales de impresoras "Modal ingresar cantidad de piezas" (730:6218, 730:5779, 730:5591, 730:6994): variante compact
 * Última sincronización: 2026-10-29
 */
import type { ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
  /** Ícono circular de 88 px (Grupo 4532), distinto en cada modal. */
  icon: string;
  title: string;
  children?: ReactNode;
  actions: ReactNode;
  /** "menu": espaciados del Modal Menu (618:12559); "compact": 16 px entre bloques (730:5779). */
  variant?: 'default' | 'menu' | 'compact';
  /** Título Regular 18 (730:6221, nombre del proceso). */
  tituloRegular?: boolean;
}

export function Modal({ icon, title, children, actions, variant = 'default', tituloRegular }: ModalProps) {
  return (
    <div className="ds-modal-overlay">
      <div className={`ds-modal ds-modal--${variant}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="ds-modal__sheet">
          <div className="ds-modal__content">
            <p className={`ds-modal__title${tituloRegular ? ' ds-modal__title--regular' : ''}`}>{title}</p>
            <div className="ds-modal__divider" />
            {children}
          </div>
          <div className="ds-modal__actions">{actions}</div>
          <div className="ds-modal__icon">
            <img src={icon} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
