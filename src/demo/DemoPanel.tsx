/**
 * Panel de apoyo para la demo (sin respaldo en Figma), fuera del dispositivo:
 * - Botones físicos de la HH (Regresar, Home) y cierre de la app (ERB-54985, ERB-48098 FR-038).
 * - Simulaciones: embarque reservado en otra HH (vence en 24 h), falla al generar el ID de entrega, red sin impresoras.
 * - Las 20 etiquetas de caja para "escanearlas" con un clic, en ráfaga, o copiarlas y capturarlas a mano.
 */
import { useState } from 'react';
import { paqueteriasMock, usuarioMock } from '../mocks/acceso';
import { embarquesMock, LONGITUD_ETIQUETA } from '../mocks/embarques';
import { useBotones } from '../navigation/botones';
import { reiniciarImpresoras, useImpresoras } from '../navigation/impresoras';
import { reiniciarDemo, useRevision, VIGENCIA_RESERVA } from '../navigation/revision';
import './DemoPanel.css';

const ETIQUETA_INVALIDA = '9'.repeat(LONGITUD_ETIQUETA);
/** Lecturas por ráfaga (ESC-03). */
const RAFAGA = 5;

export function DemoPanel({ onClose }: { onClose?: () => void }) {
  const revision = useRevision();
  const impresoras = useImpresoras();
  const botones = useBotones();
  const [copiada, setCopiada] = useState<string>();
  const sim = revision.simulacion;
  const red = impresoras.simulacion;

  const copiar = async (etiqueta: string) => {
    try {
      await navigator.clipboard.writeText(etiqueta);
      setCopiada(etiqueta);
      setTimeout(() => setCopiada((c) => (c === etiqueta ? undefined : c)), 1500);
    } catch {
      window.prompt('Copia la etiqueta:', etiqueta);
    }
  };

  const reservar = (folio: string, si: boolean) => {
    const reservados = { ...sim.reservadosOtraHH };
    if (si) reservados[folio] = Date.now();
    else delete reservados[folio];
    revision.setSimulacion({ ...sim, reservadosOtraHH: reservados });
  };
  /** Reserva de otra HH aún vigente. */
  const reservadoAjeno = (folio: string) => {
    const t = sim.reservadosOtraHH[folio];
    return t !== undefined && Date.now() - t < VIGENCIA_RESERVA;
  };

  const total = embarquesMock.reduce((n, e) => n + e.cajas.length, 0);

  return (
    <aside className="demo-panel" aria-label="Panel de demo">
      <div className="demo-panel__head">
        <div>
          <p className="demo-panel__title">Panel de demo</p>
          <p className="demo-panel__hint">
            {total} cajas · etiquetas de {LONGITUD_ETIQUETA} dígitos (folio 8 + caja 3 + total 3). Pulsa <b>Escanear</b> o
            copia la etiqueta y captúrala en el campo de escaneo (Enter para enviar).
          </p>
        </div>
        {onClose && (
          <button type="button" className="demo-panel__close" onClick={onClose} aria-label="Cerrar panel">
            ✕
          </button>
        )}
      </div>

      <div className="demo-panel__list">
        <section className="demo-panel__group">
          <p className="demo-panel__group-title">Botones físicos</p>
          <div className="demo-panel__acciones">
            <button type="button" className="demo-panel__btn demo-panel__btn--scan" onClick={botones.regresar}>
              ◀ Regresar
            </button>
            <button type="button" className="demo-panel__btn demo-panel__btn--scan" onClick={botones.home}>
              ● Home
            </button>
            <button type="button" className="demo-panel__btn" onClick={() => window.location.reload()}>
              Cerrar y reabrir app
            </button>
            <button
              type="button"
              className="demo-panel__btn"
              onClick={() => {
                reiniciarDemo();
                reiniciarImpresoras();
                window.location.reload();
              }}
            >
              Reiniciar demo
            </button>
          </div>
          <p className="demo-panel__group-sub">
            “Cerrar y reabrir” deja pendiente el embarque en curso. Sin el rol Vigilancia: inicia sesión con un número distinto de{' '}
            {usuarioMock.numero}.
          </p>
        </section>

        <section className="demo-panel__group">
          <p className="demo-panel__group-title">Simulaciones</p>
          <div className="demo-panel__acciones">
            <button type="button" className="demo-panel__btn" onClick={() => revision.adelantarReservas(VIGENCIA_RESERVA)}>
              Adelantar 24 h (vencer reservas)
            </button>
          </div>
          <label className="demo-panel__check">
            <input type="checkbox" checked={sim.fallaFolio} onChange={(e) => revision.setSimulacion({ ...sim, fallaFolio: e.target.checked })} />
            Falla al generar el ID de entrega
          </label>
          <label className="demo-panel__check">
            <input type="checkbox" checked={red.desconectada} onChange={(e) => impresoras.setSimulacion({ ...red, desconectada: e.target.checked })} />
            Red desconectada (impresoras)
          </label>
          <label className="demo-panel__check">
            <input type="checkbox" checked={red.sinImpresoras} onChange={(e) => impresoras.setSimulacion({ ...red, sinImpresoras: e.target.checked })} />
            Sin impresoras en la red
          </label>
        </section>

        {!revision.escaneoDisponible && (
          <p className="demo-panel__warning">Abre Revisión de cajas y elige una paquetería para escanear.</p>
        )}

        {embarquesMock.map((e) => {
          const p = paqueteriasMock.find((x) => x.id === e.paqueteriaId)!;
          const escaneadas = revision.escaneadas[e.folio] ?? [];
          const finalizado = revision.finalizados.includes(e.folio) || revision.entregados.includes(e.folio);
          const faltantes = e.cajas.filter((c) => !escaneadas.includes(c.numero)).slice(0, RAFAGA);
          return (
            <section key={e.folio} className="demo-panel__group">
              <p className="demo-panel__group-title">
                {p.clave} · {e.destino}
              </p>
              <p className="demo-panel__group-sub">
                FOLIO EMB: {e.folio} · {e.cajas.length} cajas{finalizado ? ' · finalizado' : ''}
              </p>
              <div className="demo-panel__acciones">
                <button
                  type="button"
                  className="demo-panel__btn demo-panel__btn--scan"
                  disabled={!revision.escaneoDisponible || finalizado || !faltantes.length}
                  onClick={() => revision.solicitarEscaneo(...faltantes.map((c) => c.etiqueta))}
                >
                  Ráfaga ×{RAFAGA}
                </button>
                <label className="demo-panel__check">
                  <input type="checkbox" checked={reservadoAjeno(e.folio)} onChange={(ev) => reservar(e.folio, ev.target.checked)} />
                  Reservado en otra HH
                </label>
              </div>
              {e.cajas.map((c) => {
                const ok = escaneadas.includes(c.numero) || finalizado;
                return (
                  <div key={c.etiqueta} className={`demo-panel__row${ok ? ' demo-panel__row--ok' : ''}`}>
                    <span className="demo-panel__num">{c.numero}</span>
                    <code className="demo-panel__code">{c.etiqueta}</code>
                    <button
                      type="button"
                      className="demo-panel__btn demo-panel__btn--scan"
                      disabled={!revision.escaneoDisponible}
                      onClick={() => revision.solicitarEscaneo(c.etiqueta)}
                    >
                      Escanear
                    </button>
                    <button type="button" className="demo-panel__btn" onClick={() => copiar(c.etiqueta)}>
                      {copiada === c.etiqueta ? 'Copiada' : 'Copiar'}
                    </button>
                  </div>
                );
              })}
            </section>
          );
        })}

        <section className="demo-panel__group">
          <p className="demo-panel__group-title">Prueba de error</p>
          <p className="demo-panel__group-sub">Etiqueta que no existe → “Etiqueta no reconocida”</p>
          <div className="demo-panel__row">
            <span className="demo-panel__num">—</span>
            <code className="demo-panel__code">{ETIQUETA_INVALIDA}</code>
            <button
              type="button"
              className="demo-panel__btn demo-panel__btn--scan"
              disabled={!revision.escaneoDisponible}
              onClick={() => revision.solicitarEscaneo(ETIQUETA_INVALIDA)}
            >
              Escanear
            </button>
            <button type="button" className="demo-panel__btn" onClick={() => copiar(ETIQUETA_INVALIDA)}>
              {copiada === ETIQUETA_INVALIDA ? 'Copiada' : 'Copiar'}
            </button>
          </div>
        </section>
      </div>
    </aside>
  );
}
