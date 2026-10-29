/**
 * Figma: indicador "Estado" de 8 px + texto (730:6562 Conectada · 730:6578 Sin conexión · 730:6145 Conectando...)
 * Última sincronización: 2026-10-29
 */
import './EstadoImpresora.css';

export type Estado = 'conectada' | 'conectando' | 'sin-conexion';

const TEXTO: Record<Estado, string> = {
  conectada: 'Conectada',
  conectando: 'Conectando...',
  'sin-conexion': 'Sin conexión',
};

/** Punto de color; con `texto` añade la leyenda del estado. */
export function EstadoImpresora({ estado, texto }: { estado: Estado; texto?: boolean }) {
  return (
    <span className="ds-estado">
      <span className={`ds-estado__punto ds-estado__punto--${estado}`} aria-hidden />
      {texto ? <span className="ds-estado__texto">{TEXTO[estado]}</span> : <span className="ds-estado__sr">{TEXTO[estado]}</span>}
    </span>
  );
}
