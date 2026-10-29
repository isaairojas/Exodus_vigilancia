/**
 * Datos de demo para el escaneo de cajas.
 * Destinos y folios tomados de Figma (565:6784, 588:9893, 618:12203); el número de cajas
 * se ajustó para tener exactamente 20 etiquetas en la demo (ver docs/figma/discrepancias.md).
 */

export interface Caja {
  numero: number;
  /** Etiqueta de embarque de 14 dígitos que lee el escáner. */
  etiqueta: string;
}

export interface Embarque {
  folio: string;
  paqueteriaId: string;
  destino: string;
  cajas: Caja[];
}

/** Etiqueta de embarque (ERB-48098): folio de pedido (8) + número de caja (3) + total de cajas (3). */
export const LONGITUD_ETIQUETA = 14;

function crearCajas(folio: string, total: number): Caja[] {
  const pad = (n: number | string, l: number) => String(n).padStart(l, '0');
  return Array.from({ length: total }, (_, i) => {
    const numero = i + 1;
    return { numero, etiqueta: `${pad(folio, 8)}${pad(numero, 3)}${pad(total, 3)}` };
  });
}

export const embarquesMock: Embarque[] = [
  { folio: '1301715', paqueteriaId: '3guerras', destino: 'TAB - Villahermosa', cajas: crearCajas('1301715', 10) },
  { folio: '1301926', paqueteriaId: '3guerras', destino: 'GDL - Guadalajara', cajas: crearCajas('1301926', 5) },
  { folio: '1301728', paqueteriaId: 'paqexpress', destino: 'CDMX - Iztapalapa', cajas: crearCajas('1301728', 5) },
];

/** Interpreta la etiqueta: el folio identifica el embarque y los dígitos siguientes la caja. */
export function buscarCaja(etiqueta: string): { embarque: Embarque; caja: Caja } | undefined {
  for (const embarque of embarquesMock) {
    const caja = embarque.cajas.find((c) => c.etiqueta === etiqueta);
    if (caja) return { embarque, caja };
  }
  return undefined;
}

/** Motivos de retiro y eliminación de embarque (ERB-48095 / ERB-48096). */
export const MOTIVO_OTROS = 'Otros';
export const motivosRetiroMock = ['Cambio de paquetería', 'Cajas rotas', 'Documentación errónea', 'Líquidos', MOTIVO_OTROS];
/** Comentario obligatorio con "Otros": 50 caracteres (indicación del usuario; el spec decía 150). */
export const MAX_COMENTARIO_MOTIVO = 50;
