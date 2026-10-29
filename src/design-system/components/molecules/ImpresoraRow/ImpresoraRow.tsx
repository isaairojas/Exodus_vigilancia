/**
 * Figma: lista "MIS IMPRESORAS" (730:6556, edición 730:6777), lista de la red (730:5457)
 *        y "Mis impresoras disponibles" del modal de proceso (730:6233, Card 730:4627).
 * Última sincronización: 2026-10-29
 */
import type { ReactNode } from 'react';
import { EstadoImpresora, type Estado } from '../EstadoImpresora/EstadoImpresora';
import printIcon from '../../../../assets/icons/proceso-print.svg';
import adfScanner from '../../../../assets/icons/proceso-adf-scanner.svg';
import deleteIcon from '../../../../assets/icons/delete-impresora.svg';
import './ImpresoraRow.css';

export function IconoImpresora({ tipo }: { tipo: 'etiquetas' | 'documentos' }) {
  return <img src={tipo === 'etiquetas' ? adfScanner : printIcon} alt="" width={20} height={20} />;
}

/** Contenedor gris con separadores entre filas. */
export function ListaImpresoras({ children, variant = 'mis' }: { children: ReactNode; variant?: 'mis' | 'red' | 'disponibles' }) {
  return <div className={`ds-impresoras ds-impresoras--${variant}`}>{children}</div>;
}

interface ImpresoraRowProps {
  nombre: string;
  tipo: 'etiquetas' | 'documentos';
  estado?: Estado;
  /** Modo edición (730:6779): ícono de eliminar a la izquierda. */
  onEliminar?: () => void;
  onClick?: () => void;
}

export function ImpresoraRow({ nombre, tipo, estado, onEliminar, onClick }: ImpresoraRowProps) {
  const contenido = (
    <div className="ds-impresora__info">
      <div className="ds-impresora__nombre-fila">
        <IconoImpresora tipo={tipo} />
        <p className="ds-impresora__nombre">{nombre}</p>
      </div>
      {estado && !onEliminar && <EstadoImpresora estado={estado} texto />}
    </div>
  );
  return (
    <div className="ds-impresora">
      {onEliminar && (
        <button type="button" className="ds-impresora__eliminar" aria-label={`Eliminar ${nombre}`} onClick={onEliminar}>
          <img src={deleteIcon} alt="" width={24} height={24} />
        </button>
      )}
      {onClick ? (
        <button type="button" className="ds-impresora__btn" onClick={onClick} aria-label={onEliminar ? `Editar IP de ${nombre}` : undefined}>
          {contenido}
        </button>
      ) : (
        contenido
      )}
    </div>
  );
}

/** Fila de texto simple: impresoras en la red (730:5459) y disponibles en el modal (730:4627). */
export function ImpresoraOpcion({ nombre, onClick }: { nombre: string; onClick: () => void }) {
  return (
    <button type="button" className="ds-impresora-opcion" onClick={onClick}>
      {nombre}
    </button>
  );
}
