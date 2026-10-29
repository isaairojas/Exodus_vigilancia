/**
 * Impresoras de demo — Figma "Módulo de configuración de impresoras por proceso" (730:5304).
 * Nombres literales del diseño (730:6252 Mis impresoras, 730:5433 impresoras en la red).
 * Las IP son supuestas salvo 192.168.1.47 (730:5787); ver docs/figma/discrepancias.md.
 */

export interface ImpresoraRed {
  nombre: string;
  ip: string;
  /** Ícono adf_scanner (etiquetas) o print (documentos), como en 730:6556. */
  tipo: 'etiquetas' | 'documentos';
  /** Demo: si responde a la validación de conectividad. */
  alcanzable: boolean;
}

export interface ProcesoImpresion {
  id: string;
  nombre: string;
}

/** Único proceso de esta versión (FR-091); la lista admite más procesos sin rediseño. */
export const PROCESO_REPORTE_DIA = 'exodus-vigilancia-reporte-dia';
export const procesosMock: ProcesoImpresion[] = [{ id: PROCESO_REPORTE_DIA, nombre: 'Exodus vigilancia  -  Reporte del día' }];

export const impresorasRedMock: ImpresoraRed[] = [
  { nombre: 'Zebra ZD620', ip: '192.168.1.48', tipo: 'etiquetas', alcanzable: true },
  { nombre: 'HP Color LaserJet Pro M1800', ip: '192.168.1.20', tipo: 'documentos', alcanzable: true },
  { nombre: 'Canon Color imageCLASS MF644Cdw', ip: '192.168.1.47', tipo: 'documentos', alcanzable: false },
  { nombre: 'Dymo LabelWriter 450', ip: '192.168.1.31', tipo: 'documentos', alcanzable: true },
  { nombre: 'ZPL M2000', ip: '192.168.1.52', tipo: 'etiquetas', alcanzable: true },
  { nombre: 'Zebra ZD411', ip: '192.168.1.53', tipo: 'etiquetas', alcanzable: true },
  { nombre: 'Zebra ZD411-4', ip: '192.168.1.54', tipo: 'etiquetas', alcanzable: true },
  { nombre: 'Samsung Xpress M2020W', ip: '192.168.1.60', tipo: 'documentos', alcanzable: true },
  { nombre: 'Lexmark MB2442adw', ip: '192.168.1.61', tipo: 'documentos', alcanzable: true },
  { nombre: 'Kyocera ECOSYS P5026cdw', ip: '192.168.1.62', tipo: 'documentos', alcanzable: true },
  { nombre: 'Ricoh SP C261SFNw', ip: '192.168.1.63', tipo: 'documentos', alcanzable: true },
  { nombre: 'Dell E310dw', ip: '192.168.1.64', tipo: 'documentos', alcanzable: true },
  { nombre: 'Xerox Phaser 6510', ip: '192.168.1.65', tipo: 'documentos', alcanzable: true },
];

/** Impresoras ya agregadas al dispositivo (730:6252). */
export const impresorasIniciales = ['Zebra ZD620', 'HP Color LaserJet Pro M1800', 'Canon Color imageCLASS MF644Cdw', 'Dymo LabelWriter 450'];

/** Asignación inicial: la impresora sin conexión, como en el primer estado del prototipo (730:5849). */
export const asignacionInicial: Record<string, string | undefined> = { [PROCESO_REPORTE_DIA]: 'Canon Color imageCLASS MF644Cdw' };

export function ipValida(ip: string) {
  const partes = ip.trim().split('.');
  return partes.length === 4 && partes.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255);
}
