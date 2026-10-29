/**
 * Figma: "Card" de Reportes del día (217:5849)
 * + línea "ID de entrega" (ERB-48105, FR-083; sin respaldo en Figma)
 * Última sincronización: 2026-10-29
 */
import type { Paqueteria } from '../../../../mocks/acceso';
import { CourierLogoFit } from '../CourierCard/CourierCard';
import './ReporteCard.css';

interface ReporteCardProps {
  paqueteria: Paqueteria;
  folio?: string;
  cierre: string;
  embarques: number;
  cajas: number;
  onClick: () => void;
}

export function ReporteCard({ paqueteria, folio, cierre, embarques, cajas, onClick }: ReporteCardProps) {
  return (
    <button type="button" className={`ds-reporte${folio ? ' ds-reporte--folio' : ''}`} onClick={onClick}>
      <div className="ds-reporte__foto">
        {paqueteria.logo && <CourierLogoFit logo={paqueteria.logo} maxWidth={61.829} maxHeight={41.22} />}
      </div>
      <div className="ds-reporte__info">
        <p className="ds-reporte__nombre">{paqueteria.nombre}</p>
        {folio && (
          <p className="ds-reporte__cierre">
            <b>ID de entrega:</b> {folio}
          </p>
        )}
        <p className="ds-reporte__cierre">
          <b>Cierre de entrega:</b> {cierre}
        </p>
        <div className="ds-reporte__conteo">
          <div className="ds-reporte__dato">
            <p>Embarques</p>
            <p className="ds-reporte__valor">{embarques}</p>
          </div>
          <div className="ds-reporte__dato">
            <p>Cajas</p>
            <p className="ds-reporte__valor">{cajas}</p>
          </div>
        </div>
      </div>
    </button>
  );
}
