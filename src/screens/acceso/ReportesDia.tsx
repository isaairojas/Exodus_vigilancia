/**
 * Figma: "Impresión de reportes" — Reportes del día (201:3951)
 * + selector de fecha y solo entregas finalizadas de ese día (ERB-48105, FR-081 / FR-082; sin respaldo en Figma)
 * Última sincronización: 2026-10-29
 */
import { Divider } from '../../design-system/components/atoms/Divider/Divider';
import { InputField } from '../../design-system/components/atoms/InputField/InputField';
import { ReporteCard } from '../../design-system/components/molecules/ReporteCard/ReporteCard';
import { Sheet } from '../../design-system/components/organisms/Sheet/Sheet';
import { buscarPaqueteria } from '../../mocks/acceso';
import { fechaISO, formatoCierre, type Entrega } from '../../mocks/reportes';

interface ReportesDiaProps {
  entregas: Entrega[];
  fecha: string;
  onFecha: (fecha: string) => void;
  onAbrir: (e: Entrega) => void;
}

export function ReportesDia({ entregas, fecha, onFecha, onAbrir }: ReportesDiaProps) {
  const delDia = entregas.filter((e) => fechaISO(e.fin) === fecha);
  return (
    <Sheet variant="menu" style={{ paddingBottom: 32 }}>
      <div className="revision__title-block">
        <p className="revision__title">Reportes del día</p>
        <Divider />
      </div>
      <InputField type="date" ariaLabel="Fecha del reporte" value={fecha} onChange={(v) => v && onFecha(v)} />
      <div className="reportes__listado">
        {delDia.map((e) => {
          const p = buscarPaqueteria(e.paqueteriaId)!;
          return (
            <ReporteCard
              key={e.folio}
              paqueteria={{ ...p, nombre: p.nombreLargo ?? p.nombre }}
              folio={e.folio}
              cierre={formatoCierre(e.fin)}
              embarques={e.totalEmbarques}
              cajas={e.totalCajas}
              onClick={() => onAbrir(e)}
            />
          );
        })}
        {!delDia.length && <p className="reportes__vacio">No hay entregas finalizadas en esta fecha.</p>}
      </div>
    </Sheet>
  );
}
