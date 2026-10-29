import { useEffect, useState } from 'react';
import { MemoryRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { DemoPanel } from './demo/DemoPanel';
import { BotonesProvider, useBotones } from './navigation/botones';
import { RevisionProvider } from './navigation/revision';
import { SessionProvider } from './navigation/session';
import { ImpresorasProvider } from './navigation/impresoras';
import { Configuraciones } from './screens/configuracion/Configuraciones';
import { Impresion } from './screens/configuracion/Impresion';
import { NuevaConexion } from './screens/configuracion/NuevaConexion';
import { InicioSesion } from './screens/acceso/InicioSesion';
import { Menu } from './screens/acceso/Menu';
import { RevisionPaqueterias } from './screens/acceso/RevisionPaqueterias';

const FRAME = { width: 480, height: 800 };
/** Ancho a partir del cual el panel de demo va junto al dispositivo. */
const PANEL_LATERAL = 900;
const PANEL_ANCHO = 360 + 32;

function useViewport() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [vp, setVp] = useState(read);
  useEffect(() => {
    const onResize = () => setVp(read());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return vp;
}

/**
 * El router vive en memoria para que el botón Atrás del sistema llegue a la app (ERB-54985) en lugar de
 * navegar por el historial; la ruta inicial se toma del hash (#/acceso/menu) para pruebas y enlaces.
 */
const rutaInicial = window.location.hash.replace(/^#/, '') || '/';

export function App() {
  return (
    <SessionProvider>
      <RevisionProvider>
        <ImpresorasProvider>
          <MemoryRouter initialEntries={[rutaInicial]}>
            <BotonesProvider>
              <Dispositivo />
            </BotonesProvider>
          </MemoryRouter>
        </ImpresorasProvider>
      </RevisionProvider>
    </SessionProvider>
  );
}

/** Un cambio de hash (enlace directo o prueba) navega a esa ruta. */
function useRutaPorHash() {
  const navigate = useNavigate();
  useEffect(() => {
    const onHash = () => navigate(window.location.hash.replace(/^#/, '') || '/', { replace: true });
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [navigate]);
}

function Dispositivo() {
  useRutaPorHash();
  const { w, h } = useViewport();
  const { enSegundoPlano } = useBotones();
  const lateral = w >= PANEL_LATERAL;
  const anchoDisponible = lateral ? w - PANEL_ANCHO - 32 : w;
  // Escala el frame de Figma (480×800) para que quepa en la pantalla sin deformarlo
  const scale = Math.min(anchoDisponible / FRAME.width, h / FRAME.height, 1);
  const [panelAbierto, setPanelAbierto] = useState(false);

  return (
    <>
      <div className="viewport">
        <div className="device-slot" style={{ width: FRAME.width * scale, height: FRAME.height * scale }}>
          <div className="device" style={{ transform: `scale(${scale})` }}>
            <Routes>
              <Route path="/acceso/inicio-sesion" element={<InicioSesion />} />
              <Route path="/acceso/menu" element={<Menu />} />
              <Route path="/acceso/revision-paqueterias" element={<RevisionPaqueterias />} />
              <Route path="/configuracion" element={<Configuraciones />} />
              <Route path="/configuracion/impresion" element={<Impresion />} />
              <Route path="/configuracion/impresion/nueva" element={<NuevaConexion />} />
              <Route path="/acceso/impresoras" element={<Navigate to="/configuracion/impresion" replace />} />
              <Route path="*" element={<Navigate to="/acceso/inicio-sesion" replace />} />
            </Routes>
            {/* Home (demo): la app pasa a segundo plano sin perder el avance */}
            {enSegundoPlano && <div className="device__segundo-plano">App en segundo plano</div>}
          </div>
        </div>
        {lateral && (
          <div className="viewport__panel" style={{ height: FRAME.height * scale }}>
            <DemoPanel />
          </div>
        )}
      </div>
      {!lateral &&
        (panelAbierto ? (
          <div className="demo-drawer">
            <DemoPanel onClose={() => setPanelAbierto(false)} />
          </div>
        ) : (
          <button type="button" className="demo-toggle" onClick={() => setPanelAbierto(true)}>
            Panel demo
          </button>
        ))}
    </>
  );
}
