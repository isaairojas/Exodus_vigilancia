/**
 * Figma: hojas inferiores de 480×740 — "Revisión paqueterías" (139:3542),
 *        "Módulo Revisión de cajas" (558:4701), "Módulo Selección paqueterías" (558:4620)
 * Última sincronización: 2026-10-28
 */
import type { CSSProperties, ReactNode } from 'react';
import './Sheet.css';

interface SheetProps {
  variant: 'menu' | 'module';
  style?: CSSProperties;
  children: ReactNode;
}

export function Sheet({ variant, style, children }: SheetProps) {
  return (
    <section className={`ds-sheet ds-sheet--${variant}`} style={style}>
      {children}
    </section>
  );
}
