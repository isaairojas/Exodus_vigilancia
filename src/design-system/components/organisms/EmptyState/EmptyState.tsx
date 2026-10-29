/**
 * Figma: estados vacíos "Aún no tienes impresoras" (730:5135) y "No encontramos impresoras" (730:5171)
 * Última sincronización: 2026-10-29
 */
import type { ReactNode } from 'react';
import './EmptyState.css';

export function EmptyState({ icon, titulo, texto, children }: { icon: string; titulo: string; texto: string; children?: ReactNode }) {
  return (
    <div className="ds-empty">
      <div className="ds-empty__centro">
        <img src={icon} alt="" width={60} height={60} />
        <p className="ds-empty__titulo">{titulo}</p>
        <p className="ds-empty__texto">{texto}</p>
      </div>
      {children && <div className="ds-empty__pie">{children}</div>}
    </div>
  );
}
