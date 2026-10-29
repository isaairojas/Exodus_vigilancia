/**
 * Figma: barra inferior de botones — "Botones regresar finalizar" (628:4146),
 *        "Botón continuar imprimir reporte" (526:5522), "Botón agregar impresora" (651:9166)
 * Última sincronización: 2026-10-28
 */
import type { ReactNode } from 'react';
import './ActionBar.css';

export function ActionBar({ children, variant = 'modal' }: { children: ReactNode; variant?: 'modal' | 'scan' }) {
  return <div className={`ds-action-bar ds-action-bar--${variant}`}>{children}</div>;
}
