/**
 * Figma: "Card proceso impresión" (730:6205) y "Card configuraciones handheld" (730:5270)
 * Última sincronización: 2026-10-29
 */
import { EstadoImpresora, type Estado } from '../EstadoImpresora/EstadoImpresora';
import { IconoImpresora } from '../ImpresoraRow/ImpresoraRow';
import arrowForward from '../../../../assets/icons/arrow-forward-ios.svg';
import './ProcesoCard.css';

interface ProcesoCardProps {
  nombre: string;
  /** Sin impresora se muestra "Sin asignar" (730:4895). */
  impresora?: { nombre: string; tipo: 'etiquetas' | 'documentos'; estado?: Estado };
  onClick: () => void;
}

export function ProcesoCard({ nombre, impresora, onClick }: ProcesoCardProps) {
  return (
    <button type="button" className="ds-proceso" onClick={onClick}>
      <div className="ds-proceso__info">
        <p className="ds-proceso__nombre">{nombre}</p>
        {impresora ? (
          <div className="ds-proceso__impresora">
            {impresora.estado && <EstadoImpresora estado={impresora.estado} />}
            <IconoImpresora tipo={impresora.tipo} />
            <p className="ds-proceso__impresora-nombre">{impresora.nombre}</p>
          </div>
        ) : (
          <p className="ds-proceso__sin-asignar">Sin asignar</p>
        )}
      </div>
      <img src={arrowForward} alt="" width={20} height={20} />
    </button>
  );
}

interface ConfigCardProps {
  icon: string;
  titulo: string;
  descripcion: string;
  onClick: () => void;
}

export function ConfigCard({ icon, titulo, descripcion, onClick }: ConfigCardProps) {
  return (
    <button type="button" className="ds-config-card" onClick={onClick}>
      <img src={icon} alt="" width={36} height={36} />
      <div className="ds-config-card__texto">
        <p className="ds-config-card__titulo">{titulo}</p>
        <p className="ds-config-card__descripcion">{descripcion}</p>
      </div>
    </button>
  );
}
