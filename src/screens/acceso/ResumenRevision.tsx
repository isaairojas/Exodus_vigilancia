/**
 * Figma: "Resumen de la revisión" — antes de finalizar (138:3384 / 530:6039), registrando (593:6263),
 *        con folio de entrega (526:5459) y desde reportes (593:5558)
 * + fila Usuario y enlace "Ver embarques" (ERB-48094, FR-062 / FR-063; sin respaldo en Figma)
 * Última sincronización: 2026-10-29
 */
import { Divider } from '../../design-system/components/atoms/Divider/Divider';
import { TextLink } from '../../design-system/components/atoms/TextLink/TextLink';
import { CourierLogoFit } from '../../design-system/components/molecules/CourierCard/CourierCard';
import { EmbarqueRow } from '../../design-system/components/molecules/EmbarqueRow/EmbarqueRow';
import { FechaCard } from '../../design-system/components/molecules/FechaCard/FechaCard';
import { InfoRow } from '../../design-system/components/molecules/InfoRow/InfoRow';
import { Sheet } from '../../design-system/components/organisms/Sheet/Sheet';
import type { Paqueteria } from '../../mocks/acceso';
import { formatoFecha, type EmbarqueEntregado } from '../../mocks/reportes';
import verifiedUser from '../../assets/icons/verified-user.svg';
import sync from '../../assets/icons/sync.svg';
import './ResumenRevision.css';

interface ResumenRevisionProps {
  paqueteria: Paqueteria;
  inicio: Date;
  fin: Date;
  /** Con folio la entrega ya está cerrada y el comentario es de solo lectura. */
  folio?: string;
  totalEmbarques: number;
  totalCajas: number;
  embarques: EmbarqueEntregado[];
  comentario: string;
  usuario?: string;
  onComentario?: (v: string) => void;
  onVerEmbarques?: () => void;
  registrando?: boolean;
}

export function ResumenRevision(props: ResumenRevisionProps) {
  const { paqueteria, folio, comentario, registrando } = props;
  return (
    <Sheet variant="menu" style={{ paddingBottom: 0, overflow: 'hidden' }}>
      <div className="revision__title-block">
        <p className="revision__title">Resumen de la revisión</p>
        <Divider />
      </div>

      {registrando ? (
        <div className="resumen__registrando">
          <div className="resumen__sync">
            <img src={sync} alt="" width={48} height={48} />
          </div>
          <div className="resumen__registrando-text">
            <p className="resumen__registrando-title">Registrando entrega</p>
            <p>Generando Folio de entrega...</p>
          </div>
        </div>
      ) : (
        <div className="resumen__scroll">
          <div className="resumen__logo">
            {paqueteria.logo && <CourierLogoFit logo={paqueteria.logo} maxWidth={170} maxHeight={60} />}
          </div>
          {folio && (
            <div className="resumen__folio">
              <p>FOLIO ENTREGA</p>
              <p>{folio}</p>
            </div>
          )}
          <FechaCard inicio={formatoFecha(props.inicio)} fin={formatoFecha(props.fin)} />
          <InfoRow label="Paquetería" value={paqueteria.clave} />
          {props.usuario && <InfoRow label="Usuario" value={props.usuario} size="small" />}
          <InfoRow label="Total embarques" value={String(props.totalEmbarques)} size="small" />
          <InfoRow label="Total cajas" value={String(props.totalCajas)} size="small" />
          {props.onComentario ? (
            <textarea
              className="resumen__comentario"
              placeholder="Añadir un comentario"
              value={comentario}
              onChange={(e) => props.onComentario!(e.target.value)}
            />
          ) : (
            <div className="resumen__comentario resumen__comentario--leido">
              <p>{comentario}</p>
            </div>
          )}
          {props.embarques.length > 0 && (
            <>
              <div className="resumen__subtitulo">
                <img src={verifiedUser} alt="" width={20} height={20} />
                <p>Embarques revisados</p>
                {props.onVerEmbarques && (
                  <TextLink className="resumen__ver-embarques" onClick={props.onVerEmbarques}>
                    Ver embarques
                  </TextLink>
                )}
              </div>
              <div className="resumen__listado">
                {props.embarques.map((e, i) => (
                  <EmbarqueRow key={e.folio + i} folio={e.folio} cajas={e.cajas} destino={e.destino} divider={i > 0} />
                ))}
                <div className="resumen__espacio" />
              </div>
            </>
          )}
        </div>
      )}
    </Sheet>
  );
}
