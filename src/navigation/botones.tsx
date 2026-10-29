/**
 * Botones físicos de la HH (ERB-54985).
 * - Regresar: el evento se intercepta a nivel aplicación (NFR-07). Cada pantalla registra su manejador
 *   con useRegresar; el botón Atrás del sistema (popstate) y el panel de demo llaman a regresar().
 * - Home: la app pasa a segundo plano sin cerrar sesión; al volver, `vuelta` cambia para que la
 *   pantalla recupere el foco del campo de captura (FR-104).
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type Manejador = () => void;

interface BotonesApi {
  regresar: () => void;
  home: () => void;
  enSegundoPlano: boolean;
  /** Aumenta cada vez que la app vuelve a primer plano. */
  vuelta: number;
  registrar: (m: Manejador) => () => void;
}

/** Tiempo que la demo deja la app en segundo plano al pulsar Home. */
const DEMORA_HOME = 1500;

const BotonesContext = createContext<BotonesApi | null>(null);

export function BotonesProvider({ children }: { children: ReactNode }) {
  const pila = useRef<Manejador[]>([]);
  const [enSegundoPlano, setEnSegundoPlano] = useState(false);
  const [vuelta, setVuelta] = useState(0);

  const regresar = useCallback(() => pila.current[pila.current.length - 1]?.(), []);

  const registrar = useCallback((m: Manejador) => {
    pila.current.push(m);
    return () => {
      pila.current = pila.current.filter((x) => x !== m);
    };
  }, []);

  const home = useCallback(() => {
    setEnSegundoPlano(true);
    setTimeout(() => {
      setEnSegundoPlano(false);
      setVuelta((v) => v + 1);
    }, DEMORA_HOME);
  }, []);

  // Botón Atrás del sistema: se mantiene una entrada de historial de guarda y se reinterpreta el evento
  useEffect(() => {
    history.pushState({ guarda: true }, '');
    const onPop = () => {
      history.pushState({ guarda: true }, '');
      regresar();
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') setVuelta((v) => v + 1);
    };
    window.addEventListener('popstate', onPop);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [regresar]);

  return (
    <BotonesContext.Provider value={{ regresar, home, enSegundoPlano, vuelta, registrar }}>{children}</BotonesContext.Provider>
  );
}

export function useBotones() {
  const ctx = useContext(BotonesContext);
  if (!ctx) throw new Error('useBotones debe usarse dentro de BotonesProvider');
  return ctx;
}

/** Registra el manejador del botón Regresar mientras la pantalla está montada (siempre el más reciente). */
export function useRegresar(manejador: Manejador) {
  const { registrar } = useBotones();
  const ref = useRef(manejador);
  ref.current = manejador;
  useEffect(() => registrar(() => ref.current()), [registrar]);
}
