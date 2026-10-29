/**
 * Figma: tarjeta "Fecha" del resumen (162:1262) — Fecha inicio / Fecha fin
 * Última sincronización: 2026-10-28
 */
import calendar from '../../../../assets/icons/calendar.svg';
import './FechaCard.css';

export function FechaCard({ inicio, fin }: { inicio: string; fin: string }) {
  return (
    <div className="ds-fecha">
      <div className="ds-fecha__head">
        <p>Fecha</p>
        <img src={calendar} alt="" width={14.589} height={16.21} />
      </div>
      <div className="ds-fecha__row">
        <p className="ds-fecha__label">Fecha inicio:</p>
        <p>{inicio}</p>
      </div>
      <div className="ds-fecha__row ds-fecha__row--last">
        <p className="ds-fecha__label">Fecha fin:</p>
        <p>{fin}</p>
      </div>
    </div>
  );
}
