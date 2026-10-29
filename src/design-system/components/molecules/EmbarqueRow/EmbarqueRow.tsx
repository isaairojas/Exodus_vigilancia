/**
 * Figma: "Card embarque" (I574:8316;289:3558) — EMBARQUE / CAJAS / DESTINO + eliminar
 * Tooltip con el destino completo al dar clic en un destino truncado (ERB-48097, sin respaldo en Figma).
 * Última sincronización: 2026-10-29
 */
import { useRef, useState } from 'react';
import deleteIcon from '../../../../assets/icons/delete.svg';
import './EmbarqueRow.css';

interface EmbarqueRowProps {
  folio: string;
  cajas: number;
  destino: string;
  /** Línea superior (todas las tarjetas menos la primera). */
  divider?: boolean;
  onDelete?: () => void;
}

/** Tiempo que el tooltip permanece visible. */
const DURACION_TOOLTIP = 2500;

export function EmbarqueRow({ folio, cajas, destino, divider, onDelete }: EmbarqueRowProps) {
  const destinoRef = useRef<HTMLParagraphElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [tooltip, setTooltip] = useState(false);

  // Clic en un destino truncado: muestra el nombre completo; otro clic lo oculta
  const alternar = () => {
    clearTimeout(timer.current);
    const el = destinoRef.current;
    if (tooltip || !el || el.scrollWidth <= el.clientWidth) return setTooltip(false);
    setTooltip(true);
    timer.current = setTimeout(() => setTooltip(false), DURACION_TOOLTIP);
  };

  return (
    <div className="ds-embarque-row">
      {divider && <div className="ds-embarque-row__divider" />}
      <div className="ds-embarque-row__card">
        <div className="ds-embarque-row__cols">
          <div className="ds-embarque-row__col">
            <p className="ds-embarque-row__label">EMBARQUE</p>
            <p className="ds-embarque-row__value">{folio}</p>
          </div>
          <div className="ds-embarque-row__col">
            <p className="ds-embarque-row__label">CAJAS</p>
            <p className="ds-embarque-row__value">{cajas}</p>
          </div>
          <div
            className="ds-embarque-row__col ds-embarque-row__col--destino"
            onClick={alternar}
          >
            <p className="ds-embarque-row__label">DESTINO</p>
            <p ref={destinoRef} className="ds-embarque-row__value ds-embarque-row__destino" title={destino}>
              {destino}
            </p>
            {tooltip && (
              <p className="ds-embarque-row__tooltip" role="tooltip">
                {destino}
              </p>
            )}
          </div>
        </div>
        {onDelete && (
          <button type="button" className="ds-embarque-row__delete" aria-label={`Retirar embarque ${folio}`} onClick={onDelete}>
            <img src={deleteIcon} alt="" width={24} height={24} />
          </button>
        )}
      </div>
    </div>
  );
}
