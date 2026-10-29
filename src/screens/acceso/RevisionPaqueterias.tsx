/**
 * Figma: "Submenú Paqueterías"
 * nodeId: 139:3540
 * Estados:
 *   - opciones  → "Revisión paqueterías" 139:3542
 *   - seleccion → "Selección de paquetería" 530:6314 (sin paqueterías) /
 *                 "Revisión de cajas - Agregar paquetería" 558:3602 (con una paquetería)
 *   - revision  → "Revisión de cajas" 530:6625 (sin embarque) / 565:6576 (embarque en curso)
 *   - embarques → "Ver embarques" 289:3128 (sección 483:5072) y retiro de embarque cerrado (505:4150)
 *   - resumen   → "Finalizar paquetería" (sección 138:2619)
 *   - reportes / reporte → "Histórico paqueterías" (sección 191:3286)
 * Escaneo y restricciones: sección 455:3300 · Retirar embarque: sección 162:1481
 * Reglas de negocio: spec ERB-45370 (docs/figma/flujos.md)
 * URL: https://www.figma.com/design/GWE1jyD5ZyUbvLUsk6pVkx/?node-id=139-3540
 * Última sincronización: 2026-10-29
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../design-system/components/atoms/Button/Button';
import { Cubito } from '../../design-system/components/atoms/Cubito/Cubito';
import { Divider } from '../../design-system/components/atoms/Divider/Divider';
import { ActionTile } from '../../design-system/components/molecules/ActionTile/ActionTile';
import { CourierCard, CourierLogoFit } from '../../design-system/components/molecules/CourierCard/CourierCard';
import { EmbarqueCard } from '../../design-system/components/molecules/EmbarqueCard/EmbarqueCard';
import { EmbarqueRow } from '../../design-system/components/molecules/EmbarqueRow/EmbarqueRow';
import { InfoRow } from '../../design-system/components/molecules/InfoRow/InfoRow';
import { SearchField } from '../../design-system/components/molecules/SearchField/SearchField';
import { Toast, type ToastData } from '../../design-system/components/molecules/Toast/Toast';
import { ActionBar } from '../../design-system/components/organisms/ActionBar/ActionBar';
import { AppHeader } from '../../design-system/components/organisms/AppHeader/AppHeader';
import { ScanBar } from '../../design-system/components/organisms/ScanBar/ScanBar';
import { Sheet } from '../../design-system/components/organisms/Sheet/Sheet';
import { TabBar, type TabItem } from '../../design-system/components/organisms/TabBar/TabBar';
import { buscarPaqueteria, ID_NO_REGISTRADA, idNoRegistrada, paqueteriasPorFrecuencia, type Paqueteria } from '../../mocks/acceso';
import { LONGITUD_ETIQUETA, type Caja, type Embarque } from '../../mocks/embarques';
import { PROCESO_REPORTE_DIA } from '../../mocks/impresoras';
import { fechaISO, type Entrega } from '../../mocks/reportes';
import { useBotones, useRegresar } from '../../navigation/botones';
import { useImpresoras } from '../../navigation/impresoras';
import { embarquePorFolio, MAX_PAQUETERIAS, useRevision } from '../../navigation/revision';
import { useSession } from '../../navigation/session';
import { reproducir } from '../../navigation/sonidos';
import {
  ModalEmbarqueFinalizado,
  ModalFinalizarEntrega,
  ModalImprimirReporte,
  ModalMenu,
  ModalMotivo,
  ModalNoRegistrada,
  ModalOtraPaqueteria,
  ModalOtroEmbarque,
  ModalPendiente,
  ModalReservado,
  ModalRetirarEmbarque,
} from './RevisionModals';
import { ReportesDia } from './ReportesDia';
import { ResumenRevision } from './ResumenRevision';
import localShipping from '../../assets/icons/local-shipping.svg';
import printIcon from '../../assets/icons/print.svg';
import tabAdd from '../../assets/icons/tab-add.svg';
import package2 from '../../assets/icons/package-2.svg';
import './RevisionPaqueterias.css';

type Estado = 'opciones' | 'seleccion' | 'revision' | 'embarques' | 'resumen' | 'reportes' | 'reporte';

type ModalState =
  | { tipo: 'menu' }
  | { tipo: 'otra-paqueteria'; embarque: Embarque; caja: Caja }
  | { tipo: 'otro-embarque'; embarque: Embarque }
  | { tipo: 'reservado'; embarque: Embarque }
  | { tipo: 'pendiente' }
  | { tipo: 'finalizado' }
  | { tipo: 'retirar'; folioCerrado?: string }
  | { tipo: 'motivo'; folioCerrado?: string }
  | { tipo: 'no-registrada' }
  | { tipo: 'finalizar-entrega' }
  | { tipo: 'imprimir' };

const TAB_ANADIR = 'anadir';
/** "After delay 900ms" en el prototipo (455:3300). */
const DEMORA_FINALIZADO = 900;
/** Duración de "Registrando entrega" (593:6263); sin dato en Figma. */
const DEMORA_REGISTRO = 1800;

const TOAST_NO_RECONOCIDA: ToastData = {
  tipo: 'error',
  titulo: 'Etiqueta no reconocida',
  mensaje: 'Escanea otra etiqueta o introduce el código manualmente.',
};
const TOAST_IMPRIMIENDO: ToastData = { tipo: 'exito', titulo: 'Imprimiendo reporte', mensaje: 'El reporte ha sido enviado para impresión.' };
// Sin respaldo en Figma (ver docs/figma/discrepancias.md)
/** Impresión fallida (sin impresora asignada o sin conexión): solo se indica que no se pudo. */
const TOAST_NO_IMPRESO: ToastData = {
  tipo: 'error',
  titulo: 'No se pudo imprimir',
  mensaje: 'No fue posible enviar el reporte a la impresora.',
};
const TOAST_ERROR_FOLIO: ToastData = {
  tipo: 'error',
  titulo: 'No se pudo finalizar la entrega',
  mensaje: 'No se generó el folio de entrega. Revisa la conexión e inténtalo de nuevo.',
};
const TOAST_REGRESAR_BLOQUEADO: ToastData = {
  tipo: 'error',
  titulo: 'No es posible regresar',
  mensaje: 'Finaliza la revisión de la entrega en curso para salir.',
};
const TOAST_EMBARQUE_CERRADO: ToastData = { tipo: 'error', titulo: 'Embarque ya revisado', mensaje: 'La caja pertenece a un embarque finalizado.' };

export function RevisionPaqueterias() {
  const navigate = useNavigate();
  const session = useSession();
  const revision = useRevision();
  const impresoras = useImpresoras();
  const { vuelta } = useBotones();
  const [estado, setEstado] = useState<Estado>(revision.abiertas.length ? 'revision' : 'opciones');
  /** Pantalla a la que regresa "Ver embarques" (conteo o resumen). */
  const [origenEmbarques, setOrigenEmbarques] = useState<'revision' | 'resumen'>('revision');
  const [modal, setModal] = useState<ModalState | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [comentario, setComentario] = useState('');
  const [registrando, setRegistrando] = useState(false);
  const [fechaReportes, setFechaReportes] = useState(() => fechaISO(new Date()));
  /** Entrega recién cerrada (resumen con folio) o abierta desde reportes. */
  const [entrega, setEntrega] = useState<Entrega>();
  const scanRef = useRef<HTMLInputElement>(null);

  const activa = buscarPaqueteria(revision.activaId);
  const embarque = activa ? embarquePorFolio(revision.embarqueActivo[activa.id]) : undefined;
  const escaneadas = embarque ? revision.escaneadas[embarque.folio] ?? [] : [];
  const revisados = revision.revisadosDe(activa?.id);
  const puedeAnadir = revision.abiertas.length < MAX_PAQUETERIAS;
  const pendiente = !!embarque && revision.pendientes.includes(embarque.folio);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return q ? paqueteriasPorFrecuencia.filter((p) => p.nombre.toLowerCase().includes(q)) : paqueteriasPorFrecuencia;
  }, [busqueda]);

  // Toast con cierre automático
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // El campo de captura siempre tiene el foco (FR-021), también al volver de segundo plano (FR-104)
  useEffect(() => {
    if (estado === 'revision' && !modal) scanRef.current?.focus();
  }, [estado, modal, revision.activaId, toast, vuelta]);

  // Embarque iniciado antes de cerrar la app (FR-038)
  useEffect(() => {
    if (estado === 'revision' && pendiente && !modal) setModal({ tipo: 'pendiente' });
  }, [estado, pendiente, modal]);

  const onScan = useCallback(
    (etiqueta: string) => {
      const r = revision.escanear(etiqueta);
      if (r.tipo === 'ok') {
        reproducir('ok');
        if (r.completo) setTimeout(() => setModal({ tipo: 'finalizado' }), DEMORA_FINALIZADO);
        return;
      }
      // Volver a escanear una caja ya marcada no suma ni interrumpe el flujo (FR-029)
      if (r.tipo === 'caja-duplicada' || r.tipo === 'sin-paqueteria') return;
      reproducir('error');
      switch (r.tipo) {
        case 'no-reconocida':
          setToast(TOAST_NO_RECONOCIDA);
          break;
        case 'otra-paqueteria':
          setModal({ tipo: 'otra-paqueteria', embarque: r.embarque, caja: r.caja });
          break;
        case 'otro-embarque':
          setModal({ tipo: 'otro-embarque', embarque: r.embarque });
          break;
        case 'reservado':
          setModal({ tipo: 'reservado', embarque: r.embarque });
          break;
        case 'embarque-cerrado':
          setToast(TOAST_EMBARQUE_CERRADO);
          break;
      }
    },
    [revision],
  );

  // Escaneos enviados desde el panel de demo, uno por render y en orden (ráfaga, NFR-02)
  const disponible = estado === 'revision' && !modal;
  useEffect(() => {
    revision.setEscaneoDisponible(disponible);
    return () => revision.setEscaneoDisponible(false);
  }, [disponible]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!disponible || !revision.colaEscaneo.length) return;
    const etiqueta = revision.consumirEscaneo();
    if (etiqueta) onScan(etiqueta);
  }, [disponible, revision.colaEscaneo]); // eslint-disable-line react-hooks/exhaustive-deps

  const seleccionar = (p: Paqueteria) => {
    if (p.id === ID_NO_REGISTRADA) return setModal({ tipo: 'no-registrada' });
    revision.abrirPaqueteria(p.id);
    setBusqueda('');
    setEstado('revision');
  };

  const courierTabs: TabItem[] = revision.abiertas.map((id) => {
    const p = buscarPaqueteria(id)!;
    if (!p.logo) return { id: p.id, icon: null, label: p.nombre };
    const ancho = 480 / (revision.abiertas.length + (puedeAnadir ? 1 : 0)) - 32;
    return { id: p.id, wideIcon: true, icon: <CourierLogoFit logo={p.logo} maxWidth={ancho} maxHeight={36} /> };
  });
  const tabAnadir: TabItem = { id: TAB_ANADIR, icon: <img src={tabAdd} alt="" width={24} height={24} />, label: 'Añadir paquetería' };
  const tabs = puedeAnadir ? [...courierTabs, tabAnadir] : courierTabs;

  const onTab = (id: string) => {
    if (id === TAB_ANADIR) return setEstado('seleccion');
    revision.activar(id);
    if (estado !== 'embarques') setEstado('revision');
  };

  const eliminarPaqueteria = () => {
    if (!activa) return;
    const quedan = revision.abiertas.length - 1;
    revision.eliminarPaqueteria(activa.id);
    setModal(null);
    if (quedan === 0) setEstado('seleccion');
  };

  const verEmbarques = (origen: 'revision' | 'resumen') => {
    setModal(null);
    setOrigenEmbarques(origen);
    setEstado('embarques');
  };

  const abrirResumen = () => {
    setModal(null);
    setEntrega(undefined);
    setEstado('resumen');
  };

  const registrarEntrega = () => {
    setModal(null);
    setRegistrando(true);
    setTimeout(() => {
      const r = revision.finalizarEntrega(comentario, session.usuario);
      setRegistrando(false);
      // Sin ID no se pierde nada: se vuelve al resumen para reintentar (FR-067)
      if (!r.ok) return setToast(TOAST_ERROR_FOLIO);
      setComentario('');
      setEntrega(r.entrega);
      setToast({ tipo: 'exito', titulo: 'Entrega finalizada', mensaje: 'La entrega de cajas a la paquetería ha sido finalizada correctamente.' });
    }, DEMORA_REGISTRO);
  };

  /** Envía el reporte a la impresora asignada al proceso "Reporte del día" (FR-071). */
  const imprimirReporte = () => {
    const r = impresoras.imprimir(PROCESO_REPORTE_DIA);
    setToast(r === 'ok' ? TOAST_IMPRIMIENDO : TOAST_NO_IMPRESO);
  };

  // Botón de continuidad tras cerrar la entrega (FR-072)
  const otraEnCurso = entrega ? revision.abiertas.find((a) => a !== entrega.paqueteriaId && revision.enCurso(a)) : undefined;
  const continuar = () => {
    if (entrega) revision.eliminarPaqueteria(entrega.paqueteriaId);
    setEntrega(undefined);
    if (otraEnCurso) {
      revision.activar(otraEnCurso);
      setEstado('revision');
    } else {
      setEstado('seleccion');
    }
  };

  // Botón físico Regresar (ERB-54985)
  const hayEntregaEnCurso = revision.abiertas.some((a) => revision.enCurso(a));
  const regresar = () => {
    if (registrando) return;
    if (modal) {
      if (modal.tipo !== 'finalizado' && modal.tipo !== 'pendiente') setModal(null);
      return;
    }
    switch (estado) {
      case 'opciones':
        return navigate('/acceso/menu');
      case 'seleccion':
        return setEstado(revision.abiertas.length ? 'revision' : 'opciones');
      case 'revision':
        // Con una entrega o embarque en curso no se sale del flujo (FR-101)
        if (hayEntregaEnCurso) return setToast(TOAST_REGRESAR_BLOQUEADO);
        return setEstado('opciones');
      case 'embarques':
        return setEstado(origenEmbarques);
      case 'resumen':
        return entrega ? continuar() : setEstado('revision');
      case 'reportes':
        return setEstado('opciones');
      case 'reporte':
        return setEstado('reportes');
    }
  };
  useRegresar(regresar);

  const nombreUsuario = { userName: session.nombre, userId: session.usuario };
  const header = (() => {
    switch (estado) {
      case 'opciones':
        return <AppHeader backLabel="Menú" onBack={regresar} {...nombreUsuario} />;
      case 'revision':
        return <AppHeader onMenu={() => setModal({ tipo: 'menu' })} {...nombreUsuario} />;
      case 'resumen':
        return <AppHeader onBack={registrando ? undefined : regresar} {...nombreUsuario} />;
      default:
        return <AppHeader onBack={regresar} {...nombreUsuario} />;
    }
  })();

  // Datos del resumen: entrega cerrada o revisión en curso de la paquetería activa
  const resumen = (() => {
    if (entrega) return { ...entrega, paqueteria: buscarPaqueteria(entrega.paqueteriaId)! };
    if (!activa) return undefined;
    return {
      paqueteria: activa,
      inicio: new Date(revision.inicio[activa.id] ?? Date.now()),
      // Fecha fin = última caja escaneada (FR-062)
      fin: new Date(revision.ultimo[activa.id] ?? Date.now()),
      folio: undefined,
      usuario: session.usuario,
      totalEmbarques: revisados.length,
      totalCajas: revisados.reduce((n, e) => n + e.cajas.length, 0),
      embarques: revisados.map((e) => ({ folio: e.folio, cajas: e.cajas.length, destino: e.destino })),
      comentario,
    };
  })();

  return (
    <div className="revision">
      {header}

      {estado === 'opciones' && (
        <Sheet variant="menu">
          <div className="revision__title-block">
            <p className="revision__title">Revisión paqueterías</p>
            <Divider />
          </div>
          <ActionTile
            label="Revisión de cajas"
            icon={{ src: localShipping, left: 259, top: 15, width: 180, height: 131, blendLighten: true }}
            onClick={() => setEstado(revision.abiertas.length ? 'revision' : 'seleccion')}
          />
          <ActionTile
            label="Impresión reportes"
            icon={{ src: printIcon, left: 266, top: 15, width: 157, height: 141 }}
            onClick={() => setEstado('reportes')}
          />
        </Sheet>
      )}

      {estado === 'seleccion' && (
        <Sheet
          variant="module"
          style={revision.abiertas.length ? { paddingBottom: 47 } : { paddingTop: 22, paddingBottom: 48 }}
        >
          {revision.abiertas.length ? (
            <TabBar tabs={tabs} selectedId={TAB_ANADIR} onSelect={onTab} />
          ) : (
            <div className="revision__title-block">
              <p className="revision__title">Revisión de cajas</p>
              <Divider />
            </div>
          )}
          <SearchField placeholder="Buscar paquetería" value={busqueda} onChange={setBusqueda} />
          <div className="revision__grid">
            {filtradas.map((p) => (
              <CourierCard key={p.id} paqueteria={p} width={p.id === '3guerras' ? 195 : 198} onSelect={seleccionar} />
            ))}
          </div>
        </Sheet>
      )}

      {estado === 'revision' && activa && (
        <>
          <Sheet variant="module" style={{ paddingBottom: 124 }}>
            <TabBar tabs={tabs} selectedId={activa.id} onSelect={onTab} />
            <div className={`revision__interfaz${embarque ? ' revision__interfaz--embarque' : ''}`}>
              <InfoRow label="Paquetería" value={activa.clave} />
              <InfoRow label="Total embarques revisados" value={String(revisados.length)} />
              {embarque ? (
                <EmbarqueCard
                  destino={embarque.destino}
                  folio={embarque.folio}
                  total={embarque.cajas.length}
                  escaneadas={escaneadas.length}
                />
              ) : (
                <div className="revision__empty">
                  <div className="revision__empty-text">
                    <p className="revision__empty-title">Escanea una caja</p>
                    <p className="revision__empty-body">{'Escanea cualquier caja para comenzar \nla revisión de un embarque.'}</p>
                  </div>
                  <img className="revision__empty-icon" src={package2} alt="" width={111} height={123} />
                </div>
              )}
            </div>
            {embarque && (
              <div className="revision__cajas">
                {embarque.cajas.map((c) => (
                  <Cubito key={c.numero} numero={c.numero} escaneada={escaneadas.includes(c.numero)} />
                ))}
              </div>
            )}
          </Sheet>
          <ScanBar ref={scanRef} onScan={onScan} maxLength={LONGITUD_ETIQUETA} />
        </>
      )}

      {estado === 'embarques' && activa && (
        <Sheet variant="module" style={{ paddingBottom: 48 }}>
          <TabBar tabs={courierTabs} selectedId={activa.id} onSelect={onTab} />
          <div className="revision__interfaz">
            <InfoRow label="Paquetería" value={activa.clave} />
            <InfoRow label="Total embarques revisados" value={String(revisados.length)} />
            <div className="embarques__listado">
              {revisados.map((e, i) => (
                <EmbarqueRow
                  key={e.folio}
                  folio={e.folio}
                  cajas={e.cajas.length}
                  destino={e.destino}
                  divider={i > 0}
                  onDelete={() => setModal({ tipo: 'retirar', folioCerrado: e.folio })}
                />
              ))}
            </div>
          </div>
        </Sheet>
      )}

      {estado === 'resumen' && resumen && (
        <>
          <ResumenRevision
            paqueteria={resumen.paqueteria}
            inicio={resumen.inicio}
            fin={resumen.fin}
            folio={resumen.folio}
            usuario={resumen.usuario}
            totalEmbarques={resumen.totalEmbarques}
            totalCajas={resumen.totalCajas}
            embarques={resumen.embarques}
            comentario={resumen.comentario}
            onComentario={entrega ? undefined : setComentario}
            onVerEmbarques={entrega ? undefined : () => verEmbarques('resumen')}
            registrando={registrando}
          />
          {!registrando && (
            <ActionBar>
              {entrega ? (
                <>
                  <Button onClick={continuar}>{otraEnCurso ? 'Regresar a entrega en curso' : 'Realizar nueva entrega'}</Button>
                  <Button variant="success" onClick={imprimirReporte}>
                    Imprimir reporte
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setEstado('revision')}>Agregar embarque</Button>
                  <Button
                    variant="danger"
                    disabled={!!embarque || !revisados.length}
                    onClick={() => setModal({ tipo: 'finalizar-entrega' })}
                  >
                    Finalizar entrega
                  </Button>
                </>
              )}
            </ActionBar>
          )}
        </>
      )}

      {estado === 'reportes' && (
        <ReportesDia
          entregas={revision.entregas}
          fecha={fechaReportes}
          onFecha={setFechaReportes}
          onAbrir={(e) => {
            setEntrega(e);
            setEstado('reporte');
          }}
        />
      )}

      {estado === 'reporte' && entrega && (
        <>
          <ResumenRevision
            paqueteria={buscarPaqueteria(entrega.paqueteriaId)!}
            inicio={entrega.inicio}
            fin={entrega.fin}
            folio={entrega.folio}
            usuario={entrega.usuario}
            totalEmbarques={entrega.totalEmbarques}
            totalCajas={entrega.totalCajas}
            embarques={entrega.embarques}
            comentario={entrega.comentario}
          />
          <ActionBar>
            <Button onClick={() => setEstado('reportes')}>Regresar</Button>
            <Button variant="success" onClick={() => setModal({ tipo: 'imprimir' })}>
              Imprimir reporte
            </Button>
          </ActionBar>
        </>
      )}

      {modal?.tipo === 'menu' && (
        <ModalMenu
          hayEmbarque={!!embarque}
          hayRevisados={revisados.length > 0}
          onRetirar={() => setModal({ tipo: 'retirar' })}
          onEliminarPaqueteria={eliminarPaqueteria}
          onVerEmbarques={() => verEmbarques('revision')}
          onFinalizarEntrega={abrirResumen}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.tipo === 'retirar' && (
        <ModalRetirarEmbarque
          cerrado={!!modal.folioCerrado}
          onNo={() => setModal(null)}
          onSi={() => setModal({ tipo: 'motivo', folioCerrado: modal.folioCerrado })}
        />
      )}
      {modal?.tipo === 'motivo' && (
        <ModalMotivo
          onNo={() => setModal(null)}
          onSi={(motivo, comentarioMotivo) => {
            if (modal.folioCerrado) revision.retirarFinalizado(modal.folioCerrado, motivo, comentarioMotivo, session.usuario);
            else revision.retirarEmbarque(motivo, comentarioMotivo, session.usuario);
            setModal(null);
            setToast({ tipo: 'exito', titulo: 'Embarque eliminado', mensaje: 'Se eliminó el embarque de la entrega.' });
          }}
        />
      )}
      {modal?.tipo === 'no-registrada' && (
        <ModalNoRegistrada
          onNo={() => setModal(null)}
          onSi={(nombre) => {
            setModal(null);
            revision.abrirPaqueteria(idNoRegistrada(nombre));
            setBusqueda('');
            setEstado('revision');
          }}
        />
      )}
      {modal?.tipo === 'otra-paqueteria' && (
        <ModalOtraPaqueteria embarque={modal.embarque} caja={modal.caja} onClose={() => setModal(null)} />
      )}
      {modal?.tipo === 'otro-embarque' && <ModalOtroEmbarque embarque={modal.embarque} onClose={() => setModal(null)} />}
      {modal?.tipo === 'reservado' && <ModalReservado embarque={modal.embarque} onClose={() => setModal(null)} />}
      {modal?.tipo === 'pendiente' && embarque && (
        <ModalPendiente
          embarque={embarque}
          onCancelar={() => {
            revision.resolverPendiente(false);
            setModal(null);
          }}
          onContinuar={() => {
            revision.resolverPendiente(true);
            setModal(null);
          }}
        />
      )}
      {modal?.tipo === 'finalizado' && (
        <ModalEmbarqueFinalizado
          onSi={() => {
            revision.finalizarEmbarque();
            setModal(null);
          }}
          onNo={() => {
            // Con todas las cajas escaneadas, la X confirma la finalización de la entrega: el embarque se cierra
            // y sigue el flujo de "Finalizar paquetería" (138:2619) desde el resumen (FR-047)
            revision.finalizarEmbarque();
            abrirResumen();
          }}
        />
      )}
      {modal?.tipo === 'finalizar-entrega' && activa && (
        <ModalFinalizarEntrega
          paqueteria={activa.nombreLargo ?? activa.nombre}
          onNo={() => setModal(null)}
          onSi={registrarEntrega}
        />
      )}
      {modal?.tipo === 'imprimir' && (
        <ModalImprimirReporte
          onNo={() => setModal(null)}
          onSi={() => {
            setModal(null);
            imprimirReporte();
          }}
        />
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
