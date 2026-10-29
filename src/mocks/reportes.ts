/**
 * Entregas cerradas previamente ("Reportes del día", Figma 201:3951 / 593:5558).
 * Valores literales del diseño; la demo agrega al inicio las entregas que se finalicen.
 * Las fechas se trasladan al día actual (con las horas de Figma) para que aparezcan en el
 * selector de fecha de "Resumen del día" (ERB-48105); ver docs/figma/discrepancias.md.
 */

export interface EmbarqueEntregado {
  folio: string;
  cajas: number;
  destino: string;
}

export interface Entrega {
  folio: string;
  paqueteriaId: string;
  inicio: Date;
  fin: Date;
  comentario: string;
  /** Número de empleado que cerró la entrega. */
  usuario?: string;
  totalEmbarques: number;
  totalCajas: number;
  embarques: EmbarqueEntregado[];
}

/** Siguiente folio de entrega (Figma muestra 10205600033 en 526:5738). */
export const FOLIO_ENTREGA_INICIAL = 10205600033;

/** Hoy a la hora indicada (y días atrás). */
function hoy(h: number, m: number, diasAtras = 0) {
  const d = new Date();
  d.setDate(d.getDate() - diasAtras);
  d.setHours(h, m, 0, 0);
  return d;
}

export const entregasMock: Entrega[] = [
  {
    folio: '10205600033',
    paqueteriaId: '3guerras',
    inicio: hoy(11, 22),
    fin: hoy(12, 15),
    comentario: '',
    totalEmbarques: 5,
    totalCajas: 49,
    embarques: [
      { folio: '1301715', cajas: 13, destino: 'TJN (Tijuana)' },
      { folio: '1301822', cajas: 10, destino: 'MTY (Monterrey)' },
      { folio: '1301823', cajas: 8, destino: 'GDL (Guadalajara)' },
      { folio: '1301890', cajas: 12, destino: 'CUN (Cancún)' },
      { folio: '1301954', cajas: 6, destino: 'MEX (Ciudad de México)' },
    ],
  },
  {
    folio: '10205600031',
    paqueteriaId: 'paqexpress',
    inicio: hoy(9, 40),
    fin: hoy(12, 15),
    comentario: '',
    totalEmbarques: 18,
    totalCajas: 105,
    embarques: [],
  },
  {
    folio: '10205600030',
    paqueteriaId: 'transporte-interno',
    inicio: hoy(8, 5, 1),
    fin: hoy(12, 15, 1),
    comentario: '',
    totalEmbarques: 22,
    totalCajas: 119,
    embarques: [],
  },
];

/** "27/05/2026 11:22" (526:5483) */
export function formatoFecha(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** "15/06/2026 12:15 p.m." (I217:5849;213:4837) */
export function formatoCierre(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0');
  const h = d.getHours() % 12 || 12;
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${h}:${p(d.getMinutes())} ${d.getHours() < 12 ? 'a.m.' : 'p.m.'}`;
}

/** "2026-10-29" para el selector de fecha. */
export function fechaISO(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
