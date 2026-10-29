/**
 * Figma: tarjetas de "Menús" (14:868) — Surtido de mercancía 14:869, Etiquetas Crossdocking 14:874,
 *        Revisión de paqueterías 14:879, Configuración de impresoras 14:884
 * Última sincronización: 2026-10-28
 */
import './MenuCard.css';

interface MenuCardProps {
  /** Texto con saltos de línea literales de Figma (\n). */
  label: string;
  icon: string;
  tone: 'primary' | 'alt';
  last?: boolean;
  onClick?: () => void;
}

export function MenuCard({ label, icon, tone, last, onClick }: MenuCardProps) {
  const className = `ds-menu-card ds-menu-card--${tone}${last ? ' ds-menu-card--last' : ''}`;
  const content = (
    <>
      <span className="ds-menu-card__label">{label}</span>
      <img className="ds-menu-card__icon" src={icon} alt="" />
    </>
  );
  return onClick ? (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
}
