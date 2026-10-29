/**
 * Figma: "Módulo de configuración de impresoras por proceso" (730:5304) y "Empty State" (730:4894)
 *   - Procesos impresión 730:5807 / 730:5849 · modal de proceso 730:6003 → 730:6085 → 730:6168 · sin impresoras 730:4975
 *   - Impresoras 730:6252 / 730:6513 · edición 730:6734 · eliminar 730:6863 · vacío 730:5099
 *   - Toasts 730:7015 (Impresora eliminada) · 730:7017 (No fue posible conectarse) · 730:7018 (Conexión exitosa)
 * Reglas: ERB-54938. Editar IP (FR-096) no tiene diseño: reutiliza el modal de IP manual (730:5591).
 * URL: https://www.figma.com/design/GWE1jyD5ZyUbvLUsk6pVkx/?node-id=730-5304
 * Última sincronización: 2026-10-29
 */
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, CancelButton, ConfirmButton } from '../../design-system/components/atoms/Button/Button';
import { Divider } from '../../design-system/components/atoms/Divider/Divider';
import { InputField } from '../../design-system/components/atoms/InputField/InputField';
import { TextLink } from '../../design-system/components/atoms/TextLink/TextLink';
import { EstadoImpresora } from '../../design-system/components/molecules/EstadoImpresora/EstadoImpresora';
import { ImpresoraOpcion, ImpresoraRow, ListaImpresoras } from '../../design-system/components/molecules/ImpresoraRow/ImpresoraRow';
import { ProcesoCard } from '../../design-system/components/molecules/ProcesoCard/ProcesoCard';
import { SegmentedTabs } from '../../design-system/components/molecules/SegmentedTabs/SegmentedTabs';
import { Toast, type ToastData } from '../../design-system/components/molecules/Toast/Toast';
import { ActionBar } from '../../design-system/components/organisms/ActionBar/ActionBar';
import { AppHeader } from '../../design-system/components/organisms/AppHeader/AppHeader';
import { EmptyState } from '../../design-system/components/organisms/EmptyState/EmptyState';
import { Modal } from '../../design-system/components/organisms/Modal/Modal';
import { Sheet } from '../../design-system/components/organisms/Sheet/Sheet';
import { ipValida } from '../../mocks/impresoras';
import { useRegresar } from '../../navigation/botones';
import { useImpresoras } from '../../navigation/impresoras';
import { useSession } from '../../navigation/session';
import arrowForward from '../../assets/icons/arrow-forward-ios.svg';
import edit from '../../assets/icons/edit.svg';
import printAdd from '../../assets/icons/print-add.svg';
import printAddEmpty from '../../assets/icons/print-add-empty.svg';
import printDisabled from '../../assets/icons/print-disabled.svg';
import arrowRight from '../../assets/icons/arrow-right-alt.svg';
import iconProceso from '../../assets/icons/modal-icon-proceso.svg';
import iconEliminar from '../../assets/icons/modal-icon-eliminar-impresora.svg';
import iconConexion from '../../assets/icons/modal-icon-nueva-conexion.svg';
import './Configuracion.css';

type Tab = 'procesos' | 'impresoras';
type ModalState = { tipo: 'proceso'; id: string } | { tipo: 'eliminar'; nombre: string } | { tipo: 'ip'; nombre: string };

export const TOAST_CONEXION_EXITOSA: ToastData = { tipo: 'exito', titulo: 'Conexión exitosa', mensaje: 'Se agregó la impresora correctamente.' };
export const TOAST_SIN_CONEXION: ToastData = {
  tipo: 'error',
  titulo: 'No fue posible conectarse',
  mensaje: 'Verifique si la impresora está encendida y en red. Inténtelo nuevamente o seleccione otra impresora.',
};
export const TOAST_IP_INVALIDA: ToastData = { tipo: 'error', titulo: 'Dirección IP inválida', mensaje: 'La IP ingresada no es válida o no se encontró en la red.' };
const TOAST_ELIMINADA: ToastData = { tipo: 'exito', titulo: 'Impresora eliminada', mensaje: 'Se eliminó la impresora correctamente.' };

export function Titulo({ partes }: { partes: string[] }) {
  return (
    <div className="config__titulo-bloque">
      <p className="config__titulo">
        {partes.map((p, i) => (
          <span key={p} className="config__titulo">
            {i > 0 && <img src={arrowForward} alt="" width={20} height={20} />}
            {p}
          </span>
        ))}
      </p>
      <Divider />
    </div>
  );
}

export function Impresion() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSession();
  const imp = useImpresoras();
  const llegada = location.state as { tab?: Tab; toast?: ToastData } | null;
  const [tab, setTab] = useState<Tab>(llegada?.tab ?? 'procesos');
  const [editando, setEditando] = useState(false);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [toast, setToast] = useState<ToastData | null>(llegada?.toast ?? null);
  const [ip, setIp] = useState('');
  const [ipError, setIpError] = useState(false);
  /** Impresora recién asignada cuya conectividad se está validando. */
  const validando = useRef<string>();

  // "Carga de estado" al abrir la pantalla (FR-094)
  useEffect(() => imp.refrescar(), []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // Resultado de la "Validación de conexión" tras asignar (BR-12: la asignación se conserva)
  useEffect(() => {
    const nombre = validando.current;
    if (!nombre) return;
    const estado = imp.estados[nombre];
    if (estado === 'sin-conexion') setToast(TOAST_SIN_CONEXION);
    if (estado && estado !== 'conectando') validando.current = undefined;
  }, [imp.estados]);

  const regresar = () => {
    if (modal) return setModal(null);
    navigate('/configuracion');
  };
  useRegresar(regresar);

  const impresora = (nombre?: string) => imp.impresoras.find((i) => i.nombre === nombre);

  const asignar = (procesoId: string, nombre: string) => {
    validando.current = nombre;
    imp.asignar(procesoId, nombre);
  };

  const guardarIp = async (nombre: string) => {
    if (!ipValida(ip)) {
      setIpError(true);
      return setToast(TOAST_IP_INVALIDA);
    }
    const encontrada = await imp.buscarPorIp(ip);
    if (!encontrada) {
      setIpError(true);
      return setToast(TOAST_IP_INVALIDA);
    }
    imp.editarIp(nombre, ip.trim());
    setModal(null);
    setToast(TOAST_CONEXION_EXITOSA);
  };

  const proceso = modal?.tipo === 'proceso' ? imp.procesos.find((p) => p.id === modal.id) : undefined;
  const asignada = proceso ? impresora(imp.asignacion[proceso.id]) : undefined;
  const procesosDe = (nombre: string) => imp.procesos.filter((p) => imp.asignacion[p.id] === nombre).map((p) => p.nombre.replace(/\s+/g, ' '));

  return (
    <div className="config">
      <AppHeader onBack={regresar} userName={session.nombre} userId={session.usuario} />
      <Sheet variant="module" style={{ paddingTop: 22, paddingLeft: 20, paddingRight: 20, paddingBottom: tab === 'impresoras' ? 146 : 22 }}>
        <Titulo partes={['Configuraciones', 'Impresión']} />
        <SegmentedTabs<Tab>
          tabs={[
            { id: 'procesos', label: 'Procesos impresión' },
            { id: 'impresoras', label: 'Impresoras' },
          ]}
          selectedId={tab}
          onSelect={(t) => {
            setTab(t);
            setEditando(false);
          }}
        />

        {tab === 'procesos' && (
          <div className="config__procesos">
            {imp.procesos.map((p) => {
              const i = impresora(imp.asignacion[p.id]);
              return (
                <ProcesoCard
                  key={p.id}
                  nombre={p.nombre}
                  impresora={i && { nombre: i.nombre, tipo: i.tipo, estado: imp.estados[i.nombre] }}
                  onClick={() => setModal({ tipo: 'proceso', id: p.id })}
                />
              );
            })}
          </div>
        )}

        {tab === 'impresoras' &&
          (imp.impresoras.length ? (
            <>
              <div className="config__encabezado">
                <p>Mis impresoras</p>
                <TextLink icon={editando ? undefined : edit} onClick={() => setEditando((e) => !e)}>
                  {editando ? 'Listo' : 'Editar'}
                </TextLink>
              </div>
              <ListaImpresoras>
                {imp.impresoras.map((i) => (
                  <ImpresoraRow
                    key={i.nombre}
                    nombre={i.nombre}
                    tipo={i.tipo}
                    estado={imp.estados[i.nombre]}
                    onEliminar={editando ? () => setModal({ tipo: 'eliminar', nombre: i.nombre }) : undefined}
                    onClick={
                      editando
                        ? () => {
                            setIp(i.ip);
                            setIpError(false);
                            setModal({ tipo: 'ip', nombre: i.nombre });
                          }
                        : undefined
                    }
                  />
                ))}
              </ListaImpresoras>
            </>
          ) : (
            <EmptyState
              icon={printAddEmpty}
              titulo="Aún no tienes impresoras"
              texto="Conecta tu primera impresora con el botón Nueva conexión para poder imprimir."
            />
          ))}
      </Sheet>

      {tab === 'impresoras' && (
        <ActionBar variant="scan">
          <Button className="config__boton-icono" onClick={() => navigate('/configuracion/impresion/nueva')}>
            Nueva conexión
            <img src={printAdd} alt="" width={24} height={24} />
          </Button>
        </ActionBar>
      )}

      {proceso && (
        <Modal variant="compact" tituloRegular icon={iconProceso} title={proceso.nombre} actions={<CancelButton onClick={() => setModal(null)} />}>
          <p className="config__etiqueta">Imprimiendo desde</p>
          {asignada ? (
            <div className="config__desde">
              <p>{asignada.nombre}</p>
              {imp.estados[asignada.nombre] && <EstadoImpresora estado={imp.estados[asignada.nombre]!} texto />}
            </div>
          ) : (
            <div className="config__desde config__desde--vacio">
              <p>Sin asignar</p>
            </div>
          )}
          <div className="ds-modal__divider" />
          <p className="config__etiqueta">Mis impresoras disponibles</p>
          {imp.impresoras.length ? (
            <ListaImpresoras variant="disponibles">
              {imp.impresoras
                .filter((i) => i.nombre !== asignada?.nombre)
                .map((i) => (
                  <ImpresoraOpcion key={i.nombre} nombre={i.nombre} onClick={() => asignar(proceso.id, i.nombre)} />
                ))}
            </ListaImpresoras>
          ) : (
            <>
              <div className="config__sin-impresoras">
                <img src={printDisabled} alt="" width={40} height={40} />
                <p>Aún no tienes impresoras</p>
              </div>
              <Button
                className="config__boton-icono"
                onClick={() => {
                  setModal(null);
                  setTab('impresoras');
                }}
              >
                Ir a Impresoras
                <img src={arrowRight} alt="" width={24} height={24} />
              </Button>
            </>
          )}
        </Modal>
      )}

      {modal?.tipo === 'eliminar' && (
        <Modal
          variant="compact"
          icon={iconEliminar}
          title="Eliminar impresora"
          actions={
            <>
              <CancelButton onClick={() => setModal(null)} />
              <ConfirmButton
                onClick={() => {
                  imp.eliminar(modal.nombre);
                  setModal(null);
                  setToast(TOAST_ELIMINADA);
                }}
              />
            </>
          }
        >
          <p className="config__texto config__texto--centro">
            {'\nEsta impresora se eliminará de la lista y se quitará de todos los procesos que la tengan configurada.\n'}
          </p>
          {procesosDe(modal.nombre).length > 0 && (
            <p className="config__texto config__texto--centro">
              <b>Quedarán sin impresora:</b> {procesosDe(modal.nombre).join(', ')}
            </p>
          )}
        </Modal>
      )}

      {modal?.tipo === 'ip' && (
        <Modal
          variant="compact"
          icon={iconConexion}
          title="Editar conexión"
          actions={
            <>
              <CancelButton onClick={() => setModal(null)} />
              <ConfirmButton disabled={!ip.trim()} onClick={() => guardarIp(modal.nombre)} />
            </>
          }
        >
          <p className="config__texto">Ingrese la IP de la impresora {modal.nombre}</p>
          <InputField
            autoFocus
            inputMode="decimal"
            ariaLabel="IP de la impresora"
            placeholder="000.000.0.00"
            value={ip}
            error={ipError}
            onChange={(v) => {
              setIp(v);
              setIpError(false);
            }}
          />
        </Modal>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
