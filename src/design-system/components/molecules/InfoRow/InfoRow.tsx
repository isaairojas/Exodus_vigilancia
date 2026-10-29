/**
 * Figma: "Courier Info Row" (558:4706) · "Total shipments reviewed Row" (558:4720)
 *        · filas del resumen "Total embarques" / "Total cajas" (162:1224, valor en B2 14 px)
 * Última sincronización: 2026-10-28
 */
import './InfoRow.css';

interface InfoRowProps {
  label: string;
  value: string;
  /** "small": valor Bold 14 px (resumen de la revisión). */
  size?: 'default' | 'small';
}

export function InfoRow({ label, value, size = 'default' }: InfoRowProps) {
  return (
    <div className="ds-info-row">
      <div className="ds-info-row__label">{label}</div>
      <div className={`ds-info-row__value${size === 'small' ? ' ds-info-row__value--small' : ''}`}>{value}</div>
    </div>
  );
}
