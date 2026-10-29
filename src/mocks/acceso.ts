import logo3Guerras from '../assets/images/logo-3guerras.png';
import logoPaqExpress from '../assets/images/logo-paqexpress.png';
import logoEstafeta from '../assets/images/logo-estafeta.png';
import logoTransporteInterno from '../assets/images/logo-transporte-interno.png';
import logoEntrega from '../assets/images/logo-entrega.png';
import logoUruz from '../assets/images/logo-uruz.png';
import logoFedex from '../assets/images/logo-fedex.png';
import logoEnvia from '../assets/images/logo-envia.png';
import logoDaspack from '../assets/images/logo-daspack.png';
import logoVencedor from '../assets/images/logo-vencedor.png';
import type { CSSProperties } from 'react';

/** Textos y valores literales del diseño (Figma 101:999). */
export const usuarioMock = {
  numero: '604512',
  contrasena: '1234567', // Figma muestra 7 puntos (2:142)
  nombre: 'Ángel Vargas Cruz',
};

/** Rol que habilita "Revisión paqueterías" en el menú (ERB-48103). */
export const ROL_VIGILANCIA = 'Vigilancia';

/** Roles por número de empleado. Demo: solo el usuario del diseño tiene el rol Vigilancia. */
export function rolesDe(numero: string): string[] {
  return numero === usuarioMock.numero ? [ROL_VIGILANCIA] : [];
}

export const cedisMock = ['CEDIS 1'];

export const versionApp = 'v 1.1.75.0';

export interface Paqueteria {
  id: string;
  nombre: string;
  /** Nombre en reportes y en "Finalizar entrega" (217:5849, 628:4238); por defecto = nombre. */
  nombreLargo?: string;
  /** Valor mostrado en "Paquetería" de Revisión de cajas (558:4714). */
  clave: string;
  /**
   * Usos en el periodo de cálculo (ERB-48101). Se calcula en un proceso previo, no en cada ingreso;
   * en la demo reproduce el orden del diseño (558:4629–4639).
   */
  usos?: number;
  logo?: {
    src: string;
    /** Proporción del contenedor del logo en Figma (241:2894). */
    aspect?: string;
    /** Tamaño fijo cuando Figma no usa proporción. */
    size?: { width: number; height: number };
    /** Recorte del image fill de Figma; sin él se usa object-fit: cover. */
    crop?: CSSProperties;
  };
}

export const paqueteriasMock: Paqueteria[] = [
  {
    id: '3guerras', usos: 412,
    nombre: '3 GUERRAS',
    nombreLargo: 'TRES GUERRAS',
    clave: '3GUERRAS',
    logo: { src: logo3Guerras, aspect: '1089 / 228', crop: { height: '159.21%', left: 0, top: '-12.28%', width: '100%' } },
  },
  { id: 'paqexpress', usos: 388, nombre: 'PAQUETE EXPRESS', clave: 'PAQUETEXPRESS' /* 558:5605 */, logo: { src: logoPaqExpress, size: { width: 142, height: 29.73 } } },
  {
    id: 'estafeta', usos: 240,
    nombre: 'ESTAFETA',
    clave: 'ESTAFETA',
    logo: { src: logoEstafeta, aspect: '142 / 23', crop: { height: '617.39%', left: 0, top: '-260.87%', width: '100%' } },
  },
  { id: 'transporte-interno', usos: 231, nombre: 'TRANSPORTE INTERNO', clave: 'TRANSPORTE INTERNO', logo: { src: logoTransporteInterno, aspect: '105 / 70' } },
  { id: 'entrega', usos: 190, nombre: 'ENTREGA', clave: 'ENTREGA', logo: { src: logoEntrega, aspect: '542 / 97' } },
  {
    id: 'uruz', usos: 150,
    nombre: 'URUZ',
    clave: 'URUZ',
    logo: { src: logoUruz, aspect: '314 / 113', crop: { height: '156.64%', left: '-11.15%', top: '-32.74%', width: '299.68%' } },
  },
  { id: 'fedex', usos: 122, nombre: 'FEDEX', clave: 'FEDEX', logo: { src: logoFedex, aspect: '345 / 146' } },
  { id: 'envia', usos: 97, nombre: 'ENVIA', clave: 'ENVIA', logo: { src: logoEnvia, aspect: '223 / 84' } },
  { id: 'daspack', usos: 64, nombre: 'DASPACK', clave: 'DASPACK', logo: { src: logoDaspack, aspect: '219 / 140' } },
  { id: 'vencedor', usos: 41, nombre: 'VENCEDOR', clave: 'VENCEDOR', logo: { src: logoVencedor, aspect: '300 / 80' } },
  { id: 'no-registrada', usos: 12, nombre: 'NO REGISTRADA', clave: 'NO REGISTRADA' },
];

/** Id de la tarjeta "Paquetería no registrada" (nombre libre, ERB-48101). */
export const ID_NO_REGISTRADA = 'no-registrada';
export const MAX_NOMBRE_NO_REGISTRADA = 50;
const PREFIJO_NO_REGISTRADA = 'nr:';

/** Listado de selección ordenado por frecuencia de uso. */
export const paqueteriasPorFrecuencia = [...paqueteriasMock].sort((a, b) => (b.usos ?? 0) - (a.usos ?? 0));

/** Id de una paquetería no registrada con el nombre capturado por el vigilante. */
export function idNoRegistrada(nombre: string) {
  return PREFIJO_NO_REGISTRADA + nombre.trim().toUpperCase();
}

/** Resuelve cualquier id de paquetería, incluidas las no registradas (sin logo; clave = nombre capturado). */
export function buscarPaqueteria(id?: string): Paqueteria | undefined {
  if (id?.startsWith(PREFIJO_NO_REGISTRADA)) {
    const nombre = id.slice(PREFIJO_NO_REGISTRADA.length);
    return { id, nombre, clave: nombre };
  }
  return paqueteriasMock.find((p) => p.id === id);
}
