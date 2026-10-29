/**
 * Estado del módulo "Revisión de cajas": paqueterías abiertas (máx. 2, una entrega por paquetería),
 * embarque en curso por paquetería, cajas escaneadas, embarques finalizados y entregas cerradas.
 * Reglas: Figma "Escaneo de cajas y restricciones" (455:3300) + spec ERB-45370.
 *
 * Demo: el estado se guarda en localStorage como sustituto del backend (tablas existentes, reservas
 * y auditoría). Al recargar la página con un embarque iniciado, éste queda "pendiente" (FR-038).
 */
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { buscarCaja, embarquesMock, LONGITUD_ETIQUETA, type Caja, type Embarque } from '../mocks/embarques';
import { entregasMock, FOLIO_ENTREGA_INICIAL, type Entrega } from '../mocks/reportes';

export const MAX_PAQUETERIAS = 2;
/** La reserva de un embarque vence a más tardar en un día (indicación del usuario, OQ-06). */
export const VIGENCIA_RESERVA = 24 * 60 * 60 * 1000;
const CLAVE_STORAGE = 'exodus-vigilancia:revision';

/** Registro de auditoría de retiros y eliminaciones; nunca aparece en reportes (BR-06). */
export interface RegistroAuditoria {
  tipo: 'retiro' | 'eliminacion';
  folio: string;
  cajasEscaneadas: number;
  usuario: string;
  fecha: Date;
  motivo: string;
  comentario: string;
}

interface RevisionState {
  abiertas: string[];
  activaId?: string;
  /** Folio del embarque en curso por paquetería (reservado para este dispositivo). */
  embarqueActivo: Record<string, string | undefined>;
  /** Números de caja escaneados por folio. */
  escaneadas: Record<string, number[]>;
  /** Embarques revisados completos, aún sin entregar. */
  finalizados: string[];
  /** Embarques que ya forman parte de una entrega cerrada. */
  entregados: string[];
  /** Primer y último escaneo por paquetería (fechas del resumen). */
  inicio: Record<string, number | undefined>;
  ultimo: Record<string, number | undefined>;
  /** Embarques iniciados antes de cerrar la app (FR-038). */
  pendientes: string[];
  /** Inicio de la reserva de cada embarque en curso de este dispositivo (folio → ms). */
  reservas: Record<string, number | undefined>;
  auditoria: RegistroAuditoria[];
  entregas: Entrega[];
  siguienteFolio: number;
}

export type ResultadoEscaneo =
  | { tipo: 'ok'; embarque: Embarque; completo: boolean }
  | { tipo: 'no-reconocida' }
  | { tipo: 'otra-paqueteria'; embarque: Embarque; caja: Caja }
  | { tipo: 'otro-embarque'; embarque: Embarque }
  | { tipo: 'reservado'; embarque: Embarque }
  | { tipo: 'caja-duplicada' }
  | { tipo: 'embarque-cerrado' }
  | { tipo: 'sin-paqueteria' };

export type ResultadoEntrega = { ok: true; entrega: Entrega } | { ok: false };

/** Simulaciones del panel de demo (sin respaldo en Figma). */
export interface SimulacionDemo {
  /** Folios reservados por otra HH y momento de la reserva (FR-036). */
  reservadosOtraHH: Record<string, number>;
  /** Falla al generar el ID de entrega (FR-067). */
  fallaFolio: boolean;
}

interface RevisionApi extends RevisionState {
  abrirPaqueteria: (id: string) => void;
  activar: (id: string) => void;
  eliminarPaqueteria: (id: string) => void;
  escanear: (etiqueta: string) => ResultadoEscaneo;
  finalizarEmbarque: () => void;
  retirarEmbarque: (motivo: string, comentario: string, usuario: string) => void;
  retirarFinalizado: (folio: string, motivo: string, comentario: string, usuario: string) => void;
  /** Continuar (conteo en cero) o cancelar (libera la reserva) el embarque pendiente de la paquetería activa. */
  resolverPendiente: (continuar: boolean) => void;
  /** Embarques finalizados (sin entregar) de una paquetería. */
  revisadosDe: (id?: string) => Embarque[];
  /** Entrega en curso: hay cajas escaneadas o embarques finalizados sin entregar (paquetería bloqueada). */
  enCurso: (id?: string) => boolean;
  finalizarEntrega: (comentario: string, usuario: string) => ResultadoEntrega;
  simulacion: SimulacionDemo;
  setSimulacion: (s: SimulacionDemo) => void;
  /** Demo: adelanta el reloj de todas las reservas (propias y de otra HH). */
  adelantarReservas: (ms: number) => void;
  /** Escaneos solicitados desde el panel de demo (en orden); los consume la pantalla de revisión. */
  colaEscaneo: string[];
  solicitarEscaneo: (...etiquetas: string[]) => void;
  consumirEscaneo: () => string | undefined;
  escaneoDisponible: boolean;
  setEscaneoDisponible: (v: boolean) => void;
}

const inicial: RevisionState = {
  abiertas: [],
  embarqueActivo: {},
  escaneadas: {},
  finalizados: [],
  entregados: [],
  inicio: {},
  ultimo: {},
  pendientes: [],
  reservas: {},
  auditoria: [],
  entregas: entregasMock,
  siguienteFolio: FOLIO_ENTREGA_INICIAL + 1,
};

function reservaVencida(desde?: number) {
  return desde !== undefined && Date.now() - desde >= VIGENCIA_RESERVA;
}

/** Recupera el estado guardado; los embarques que estaban en curso quedan pendientes y su conteo en cero. */
function cargar(): RevisionState {
  try {
    const raw = localStorage.getItem(CLAVE_STORAGE);
    if (!raw) return inicial;
    const s = JSON.parse(raw) as RevisionState;
    const fechas = (e: Entrega): Entrega => ({ ...e, inicio: new Date(e.inicio), fin: new Date(e.fin) });
    const reservas = { ...(s.reservas ?? {}) };
    const escaneadas = { ...s.escaneadas };
    const embarqueActivo = { ...s.embarqueActivo };
    // Las reservas vencidas se liberan: el embarque queda libre para cualquier HH
    for (const [id, folio] of Object.entries(embarqueActivo)) {
      if (folio && reservaVencida(reservas[folio])) {
        embarqueActivo[id] = undefined;
        delete escaneadas[folio];
        delete reservas[folio];
      }
    }
    const enCurso = Object.values(embarqueActivo).filter((f): f is string => !!f);
    for (const f of enCurso) escaneadas[f] = [];
    return {
      ...inicial,
      ...s,
      embarqueActivo,
      escaneadas,
      reservas,
      pendientes: [...new Set([...(s.pendientes ?? []), ...enCurso])].filter((f) => enCurso.includes(f)),
      auditoria: (s.auditoria ?? []).map((a) => ({ ...a, fecha: new Date(a.fecha) })),
      entregas: s.entregas.map(fechas),
    };
  } catch {
    return inicial;
  }
}

function guardar(s: RevisionState) {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(s));
  } catch {
    // Sin almacenamiento (modo privado): la demo sigue en memoria.
  }
}

export function reiniciarDemo() {
  try {
    localStorage.removeItem(CLAVE_STORAGE);
  } catch {
    // ignorado
  }
}

const RevisionContext = createContext<RevisionApi | null>(null);

const embarque = (folio: string) => embarquesMock.find((e) => e.folio === folio)!;

/** Sin cajas escaneadas ni embarques finalizados se borran las fechas de la entrega. */
function limpiarFechas(s: RevisionState, id: string): RevisionState {
  const activo = s.embarqueActivo[id];
  const revisados = s.finalizados.some((f) => embarque(f).paqueteriaId === id);
  if (activo || revisados) return s;
  return { ...s, inicio: { ...s.inicio, [id]: undefined }, ultimo: { ...s.ultimo, [id]: undefined } };
}

export function RevisionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RevisionState>(cargar);
  const ref = useRef(state);
  ref.current = state;
  const [cola, setCola] = useState<string[]>([]);
  const colaRef = useRef(cola);
  colaRef.current = cola;
  const [escaneoDisponible, setEscaneoDisponible] = useState(false);
  const [simulacion, setSimulacion] = useState<SimulacionDemo>({ reservadosOtraHH: {}, fallaFolio: false });
  const simRef = useRef(simulacion);
  simRef.current = simulacion;

  const update = (next: RevisionState) => {
    ref.current = next;
    setState(next);
    guardar(next);
  };

  const abrirPaqueteria = useCallback((id: string) => {
    const s = ref.current;
    if (s.abiertas.includes(id)) return update({ ...s, activaId: id });
    if (s.abiertas.length >= MAX_PAQUETERIAS) return;
    update({ ...s, abiertas: [...s.abiertas, id], activaId: id });
  }, []);

  const activar = useCallback((id: string) => update({ ...ref.current, activaId: id }), []);

  const eliminarPaqueteria = useCallback((id: string) => {
    const s = ref.current;
    const abiertas = s.abiertas.filter((a) => a !== id);
    update({
      ...s,
      abiertas,
      activaId: abiertas[0],
      inicio: { ...s.inicio, [id]: undefined },
      ultimo: { ...s.ultimo, [id]: undefined },
    });
  }, []);

  const escanear = useCallback((entrada: string): ResultadoEscaneo => {
    const s = ref.current;
    const etiqueta = entrada.trim();
    if (!s.activaId) return { tipo: 'sin-paqueteria' };
    if (!new RegExp(`^\\d{${LONGITUD_ETIQUETA}}$`).test(etiqueta)) return { tipo: 'no-reconocida' };
    // Validación en memoria contra los embarques precargados (NFR-03)
    const hallada = buscarCaja(etiqueta);
    if (!hallada) return { tipo: 'no-reconocida' };
    const { embarque: emb, caja } = hallada;

    if (emb.paqueteriaId !== s.activaId) return { tipo: 'otra-paqueteria', embarque: emb, caja };
    if (s.finalizados.includes(emb.folio) || s.entregados.includes(emb.folio)) return { tipo: 'embarque-cerrado' };

    const activo = s.embarqueActivo[s.activaId];
    if (activo && activo !== emb.folio) return { tipo: 'otro-embarque', embarque: emb };
    // Reserva validada en el backend (NFR-05); en la demo, folios marcados en el panel
    const ajena = simRef.current.reservadosOtraHH[emb.folio];
    if (!activo && ajena !== undefined && !reservaVencida(ajena)) return { tipo: 'reservado', embarque: emb };

    const previas = s.escaneadas[emb.folio] ?? [];
    if (previas.includes(caja.numero)) return { tipo: 'caja-duplicada' };

    const nuevas = [...previas, caja.numero];
    const ahora = Date.now();
    update({
      ...s,
      embarqueActivo: { ...s.embarqueActivo, [s.activaId]: emb.folio },
      escaneadas: { ...s.escaneadas, [emb.folio]: nuevas },
      reservas: { ...s.reservas, [emb.folio]: s.reservas[emb.folio] ?? ahora },
      inicio: { ...s.inicio, [s.activaId]: s.inicio[s.activaId] ?? ahora },
      ultimo: { ...s.ultimo, [s.activaId]: ahora },
    });
    return { tipo: 'ok', embarque: emb, completo: nuevas.length === emb.cajas.length };
  }, []);

  const finalizarEmbarque = useCallback(() => {
    const s = ref.current;
    if (!s.activaId) return;
    const folio = s.embarqueActivo[s.activaId];
    if (!folio) return;
    update({
      ...s,
      embarqueActivo: { ...s.embarqueActivo, [s.activaId]: undefined },
      finalizados: [...s.finalizados, folio],
      reservas: { ...s.reservas, [folio]: undefined },
    });
  }, []);

  const retirarEmbarque = useCallback((motivo: string, comentario: string, usuario: string) => {
    const s = ref.current;
    const id = s.activaId;
    if (!id) return;
    const folio = s.embarqueActivo[id];
    if (!folio) return;
    const escaneadas = { ...s.escaneadas };
    const registro: RegistroAuditoria = {
      tipo: 'retiro',
      folio,
      cajasEscaneadas: escaneadas[folio]?.length ?? 0,
      usuario,
      fecha: new Date(),
      motivo,
      comentario,
    };
    delete escaneadas[folio];
    // Se libera la reserva: el folio queda disponible para otra entrega
    const next = {
      ...s,
      embarqueActivo: { ...s.embarqueActivo, [id]: undefined },
      escaneadas,
      pendientes: s.pendientes.filter((f) => f !== folio),
      reservas: { ...s.reservas, [folio]: undefined },
      auditoria: [...s.auditoria, registro],
    };
    update(limpiarFechas(next, id));
  }, []);

  // 505:4150 Eliminación de embarque ya cerrado: sale de la entrega y vuelve a quedar disponible
  const retirarFinalizado = useCallback((folio: string, motivo: string, comentario: string, usuario: string) => {
    const s = ref.current;
    const escaneadas = { ...s.escaneadas };
    const registro: RegistroAuditoria = {
      tipo: 'eliminacion',
      folio,
      cajasEscaneadas: escaneadas[folio]?.length ?? 0,
      usuario,
      fecha: new Date(),
      motivo,
      comentario,
    };
    delete escaneadas[folio];
    const next = { ...s, finalizados: s.finalizados.filter((f) => f !== folio), escaneadas, auditoria: [...s.auditoria, registro] };
    update(limpiarFechas(next, embarque(folio).paqueteriaId));
  }, []);

  const resolverPendiente = useCallback((continuar: boolean) => {
    const s = ref.current;
    const id = s.activaId;
    if (!id) return;
    const folio = s.embarqueActivo[id];
    if (!folio) return;
    const next = { ...s, pendientes: s.pendientes.filter((f) => f !== folio) };
    if (continuar) return update(next);
    update(limpiarFechas({ ...next, embarqueActivo: { ...s.embarqueActivo, [id]: undefined }, reservas: { ...s.reservas, [folio]: undefined } }, id));
  }, []);

  const revisadosDe = useCallback(
    (id?: string) => state.finalizados.map(embarque).filter((e) => e.paqueteriaId === id),
    [state.finalizados],
  );

  const enCurso = useCallback(
    (id?: string) => {
      if (!id) return false;
      const activo = state.embarqueActivo[id];
      return !!activo || state.finalizados.some((f) => embarque(f).paqueteriaId === id);
    },
    [state.embarqueActivo, state.finalizados],
  );

  const finalizarEntrega = useCallback((comentario: string, usuario: string): ResultadoEntrega => {
    const s = ref.current;
    const id = s.activaId;
    if (!id || s.embarqueActivo[id]) return { ok: false };
    const embarques = s.finalizados.map(embarque).filter((e) => e.paqueteriaId === id);
    if (!embarques.length) return { ok: false };
    // Generación atómica del ID (NFR-08): ante una falla no cambia nada y se puede reintentar
    if (simRef.current.fallaFolio) return { ok: false };
    const entrega: Entrega = {
      folio: String(s.siguienteFolio),
      paqueteriaId: id,
      inicio: new Date(s.inicio[id] ?? Date.now()),
      fin: new Date(s.ultimo[id] ?? Date.now()),
      comentario,
      usuario,
      totalEmbarques: embarques.length,
      totalCajas: embarques.reduce((n, e) => n + e.cajas.length, 0),
      embarques: embarques.map((e) => ({ folio: e.folio, cajas: e.cajas.length, destino: e.destino })),
    };
    const folios = embarques.map((e) => e.folio);
    update({
      ...s,
      finalizados: s.finalizados.filter((f) => !folios.includes(f)),
      entregados: [...s.entregados, ...folios],
      entregas: [entrega, ...s.entregas],
      siguienteFolio: s.siguienteFolio + 1,
      inicio: { ...s.inicio, [id]: undefined },
      ultimo: { ...s.ultimo, [id]: undefined },
    });
    return { ok: true, entrega };
  }, []);

  const adelantarReservas = useCallback((ms: number) => {
    const s = ref.current;
    const atras = (r: Record<string, number | undefined>) =>
      Object.fromEntries(Object.entries(r).map(([f, t]) => [f, t === undefined ? t : t - ms]));
    update({ ...s, reservas: atras(s.reservas) });
    const sim = simRef.current;
    setSimulacion({ ...sim, reservadosOtraHH: atras(sim.reservadosOtraHH) as Record<string, number> });
  }, []);

  const solicitarEscaneo = useCallback((...etiquetas: string[]) => setCola((c) => [...c, ...etiquetas]), []);
  const consumirEscaneo = useCallback(() => {
    const [primera, ...resto] = colaRef.current;
    colaRef.current = resto;
    setCola(resto);
    return primera;
  }, []);

  return (
    <RevisionContext.Provider
      value={{
        ...state,
        abrirPaqueteria,
        activar,
        eliminarPaqueteria,
        escanear,
        finalizarEmbarque,
        retirarEmbarque,
        retirarFinalizado,
        resolverPendiente,
        revisadosDe,
        enCurso,
        finalizarEntrega,
        simulacion,
        setSimulacion,
        adelantarReservas,
        colaEscaneo: cola,
        solicitarEscaneo,
        consumirEscaneo,
        escaneoDisponible,
        setEscaneoDisponible,
      }}
    >
      {children}
    </RevisionContext.Provider>
  );
}

export function useRevision() {
  const ctx = useContext(RevisionContext);
  if (!ctx) throw new Error('useRevision debe usarse dentro de RevisionProvider');
  return ctx;
}

export function embarquePorFolio(folio?: string) {
  return embarquesMock.find((e) => e.folio === folio);
}
