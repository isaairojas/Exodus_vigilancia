/**
 * Impresoras del dispositivo y su asignación por proceso (ERB-54938, Figma 730:5304).
 * Se guardan a nivel dispositivo y sobreviven a reinicios y cambios de sesión (FR-098).
 * Conectividad y búsqueda en red son asíncronas y no bloquean la interfaz (NFR-13).
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  asignacionInicial,
  impresorasIniciales,
  impresorasRedMock,
  procesosMock,
  type ImpresoraRed,
  type ProcesoImpresion,
} from '../mocks/impresoras';

export type EstadoImpresora = 'conectada' | 'conectando' | 'sin-conexion';
export type ResultadoImpresion = 'ok' | 'sin-impresora' | 'sin-conexion';

const CLAVE_STORAGE = 'exodus-vigilancia:impresoras';
/** Tiempo de la validación de conectividad ("Carga de estado", "Validación de conexión"). */
const DEMORA_CONEXION = 1200;
/** Tiempo de "Carga de impresoras en la red" (730:5524). */
const DEMORA_BUSQUEDA = 1500;
/** Actualización periódica del estado (FR-094). */
const INTERVALO_ESTADO = 15000;

interface Guardado {
  impresoras: ImpresoraRed[];
  asignacion: Record<string, string | undefined>;
}

/** Simulaciones del panel de demo (sin respaldo en Figma). */
export interface SimulacionRed {
  /** Error de desconexión al buscar en la red (FR-095). */
  desconectada: boolean;
  /** La búsqueda no encuentra impresoras (730:5149). */
  sinImpresoras: boolean;
}

interface ImpresorasApi {
  /** En orden alfabético (FR-094). */
  impresoras: ImpresoraRed[];
  estados: Record<string, EstadoImpresora | undefined>;
  procesos: ProcesoImpresion[];
  asignacion: Record<string, string | undefined>;
  asignar: (procesoId: string, nombre: string) => void;
  agregar: (impresora: ImpresoraRed) => void;
  eliminar: (nombre: string) => void;
  editarIp: (nombre: string, ip: string) => void;
  /** Revalida la conectividad de todas las impresoras. */
  refrescar: () => void;
  /** Impresoras de la red aún no agregadas; rechaza si la red está desconectada. */
  buscarEnRed: () => Promise<ImpresoraRed[]>;
  buscarPorIp: (ip: string) => Promise<ImpresoraRed | undefined>;
  imprimir: (procesoId: string) => ResultadoImpresion;
  simulacion: SimulacionRed;
  setSimulacion: (s: SimulacionRed) => void;
}

function cargar(): Guardado {
  const porDefecto = {
    impresoras: impresorasRedMock.filter((i) => impresorasIniciales.includes(i.nombre)),
    asignacion: asignacionInicial,
  };
  try {
    const raw = localStorage.getItem(CLAVE_STORAGE);
    return raw ? (JSON.parse(raw) as Guardado) : porDefecto;
  } catch {
    return porDefecto;
  }
}

export function reiniciarImpresoras() {
  try {
    localStorage.removeItem(CLAVE_STORAGE);
  } catch {
    // ignorado
  }
}

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));
const ordenar = (l: ImpresoraRed[]) => [...l].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

const ImpresorasContext = createContext<ImpresorasApi | null>(null);

export function ImpresorasProvider({ children }: { children: ReactNode }) {
  const [guardado, setGuardado] = useState<Guardado>(cargar);
  const [estados, setEstados] = useState<Record<string, EstadoImpresora | undefined>>({});
  const [simulacion, setSimulacion] = useState<SimulacionRed>({ desconectada: false, sinImpresoras: false });
  const simRef = useRef(simulacion);
  simRef.current = simulacion;

  const actualizar = (fn: (g: Guardado) => Guardado) =>
    setGuardado((g) => {
      const next = fn(g);
      try {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(next));
      } catch {
        // ignorado
      }
      return next;
    });

  /** Pasa a "Conectando..." y, tras la validación, a Conectada o Sin conexión. */
  const validar = useCallback((lista: ImpresoraRed[]) => {
    setEstados((e) => ({ ...e, ...Object.fromEntries(lista.map((i) => [i.nombre, 'conectando' as const])) }));
    setTimeout(() => {
      setEstados((e) => ({
        ...e,
        ...Object.fromEntries(lista.map((i) => [i.nombre, i.alcanzable ? ('conectada' as const) : ('sin-conexion' as const)])),
      }));
    }, DEMORA_CONEXION);
  }, []);

  const refrescar = useCallback(() => validar(guardado.impresoras), [guardado.impresoras, validar]);

  useEffect(() => {
    refrescar();
    const t = setInterval(refrescar, INTERVALO_ESTADO);
    return () => clearInterval(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const asignar = useCallback(
    (procesoId: string, nombre: string) => {
      // La asignación se aplica aunque la impresora no responda (BR-12)
      actualizar((g) => ({ ...g, asignacion: { ...g.asignacion, [procesoId]: nombre } }));
      const imp = guardado.impresoras.find((i) => i.nombre === nombre);
      if (imp) validar([imp]);
    },
    [guardado.impresoras, validar],
  );

  const agregar = useCallback(
    (impresora: ImpresoraRed) => {
      actualizar((g) => ({ ...g, impresoras: [...g.impresoras.filter((i) => i.nombre !== impresora.nombre), impresora] }));
      validar([impresora]);
    },
    [validar],
  );

  const eliminar = useCallback((nombre: string) => {
    actualizar((g) => ({
      impresoras: g.impresoras.filter((i) => i.nombre !== nombre),
      asignacion: Object.fromEntries(Object.entries(g.asignacion).map(([p, n]) => [p, n === nombre ? undefined : n])),
    }));
  }, []);

  const editarIp = useCallback(
    (nombre: string, ip: string) => {
      const red = impresorasRedMock.find((i) => i.ip === ip);
      const editada = { ...guardado.impresoras.find((i) => i.nombre === nombre)!, ip, alcanzable: !!red?.alcanzable };
      actualizar((g) => ({ ...g, impresoras: g.impresoras.map((i) => (i.nombre === nombre ? editada : i)) }));
      validar([editada]);
    },
    [guardado.impresoras, validar],
  );

  const buscarEnRed = useCallback(async () => {
    await esperar(DEMORA_BUSQUEDA);
    if (simRef.current.desconectada) throw new Error('desconectada');
    if (simRef.current.sinImpresoras) return [];
    return impresorasRedMock.filter((r) => !guardado.impresoras.some((i) => i.nombre === r.nombre));
  }, [guardado.impresoras]);

  const buscarPorIp = useCallback(async (ip: string) => {
    await esperar(DEMORA_CONEXION / 2);
    if (simRef.current.desconectada) return undefined;
    return impresorasRedMock.find((r) => r.ip === ip.trim());
  }, []);

  const imprimir = useCallback(
    (procesoId: string): ResultadoImpresion => {
      const nombre = guardado.asignacion[procesoId];
      if (!nombre) return 'sin-impresora';
      return estados[nombre] === 'sin-conexion' ? 'sin-conexion' : 'ok';
    },
    [guardado.asignacion, estados],
  );

  return (
    <ImpresorasContext.Provider
      value={{
        impresoras: ordenar(guardado.impresoras),
        estados,
        procesos: procesosMock,
        asignacion: guardado.asignacion,
        asignar,
        agregar,
        eliminar,
        editarIp,
        refrescar,
        buscarEnRed,
        buscarPorIp,
        imprimir,
        simulacion,
        setSimulacion,
      }}
    >
      {children}
    </ImpresorasContext.Provider>
  );
}

export function useImpresoras() {
  const ctx = useContext(ImpresorasContext);
  if (!ctx) throw new Error('useImpresoras debe usarse dentro de ImpresorasProvider');
  return ctx;
}
