/**
 * Figma: "Mis impresoras > Nueva conexión" (730:5304)
 *   - Carga de impresoras en la red 730:5305 → lista 730:5431 → confirmación 730:5713
 *   - Ingreso de IP manual 730:5525 → confirmación 730:5619 · error 730:7016 (Dirección IP inválida)
 *   - Sin resultados "No encontramos impresoras" 730:5149
 * Reglas: ERB-54938 FR-095. El toast de desconexión de red no tiene diseño (se usa el Toast rojo).
 * URL: https://www.figma.com/design/GWE1jyD5ZyUbvLUsk6pVkx/?node-id=730-5431
 * Última sincronización: 2026-10-29
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, CancelButton, ConfirmButton } from '../../design-system/components/atoms/Button/Button';
import { InputField } from '../../design-system/components/atoms/InputField/InputField';
import { TextLink } from '../../design-system/components/atoms/TextLink/TextLink';
import { ImpresoraOpcion, ListaImpresoras } from '../../design-system/components/molecules/ImpresoraRow/ImpresoraRow';
import { Toast, type ToastData } from '../../design-system/components/molecules/Toast/Toast';
import { ActionBar } from '../../design-system/components/organisms/ActionBar/ActionBar';
import { AppHeader } from '../../design-system/components/organisms/AppHeader/AppHeader';
import { EmptyState } from '../../design-system/components/organisms/EmptyState/EmptyState';
import { Modal } from '../../design-system/components/organisms/Modal/Modal';
import { Sheet } from '../../design-system/components/organisms/Sheet/Sheet';
import { ipValida, type ImpresoraRed } from '../../mocks/impresoras';
import { useRegresar } from '../../navigation/botones';
import { useImpresoras } from '../../navigation/impresoras';
import { useSession } from '../../navigation/session';
import printError from '../../assets/icons/print-error.svg';
import replay from '../../assets/icons/replay.svg';
import iconConexion from '../../assets/icons/modal-icon-nueva-conexion.svg';
import { Titulo, TOAST_CONEXION_EXITOSA, TOAST_IP_INVALIDA } from './Impresion';
import './Configuracion.css';

type Busqueda = 'buscando' | 'lista' | 'vacia';
type ModalState = { tipo: 'confirmar'; impresora: ImpresoraRed } | { tipo: 'ip' };

// Sin respaldo en Figma
const TOAST_DESCONECTADA: ToastData = { tipo: 'error', titulo: 'Sin conexión a la red', mensaje: 'Revisa la conexión del dispositivo e inténtalo de nuevo.' };
const TOAST_YA_AGREGADA: ToastData = { tipo: 'error', titulo: 'Impresora ya agregada', mensaje: 'Esta impresora ya está en tu lista.' };

export function NuevaConexion() {
  const navigate = useNavigate();
  const session = useSession();
  const imp = useImpresoras();
  const [busqueda, setBusqueda] = useState<Busqueda>('buscando');
  const [encontradas, setEncontradas] = useState<ImpresoraRed[]>([]);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [ip, setIp] = useState('');
  const [ipError, setIpError] = useState(false);

  const buscar = () => {
    setBusqueda('buscando');
    imp
      .buscarEnRed()
      .then((l) => {
        setEncontradas(l);
        setBusqueda(l.length ? 'lista' : 'vacia');
      })
      .catch(() => {
        setEncontradas([]);
        setBusqueda('vacia');
        setToast(TOAST_DESCONECTADA);
      });
  };

  useEffect(buscar, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const regresar = () => {
    if (modal) return setModal(null);
    navigate('/configuracion/impresion', { state: { tab: 'impresoras' } });
  };
  useRegresar(regresar);

  const validarIp = async () => {
    if (!ipValida(ip)) {
      setIpError(true);
      return setToast(TOAST_IP_INVALIDA);
    }
    const impresora = await imp.buscarPorIp(ip);
    if (!impresora) {
      setIpError(true);
      return setToast(TOAST_IP_INVALIDA);
    }
    if (imp.impresoras.some((i) => i.nombre === impresora.nombre)) return setToast(TOAST_YA_AGREGADA);
    setModal({ tipo: 'confirmar', impresora });
  };

  const agregar = (impresora: ImpresoraRed) => {
    imp.agregar(impresora);
    navigate('/configuracion/impresion', { state: { tab: 'impresoras', toast: TOAST_CONEXION_EXITOSA } });
  };

  return (
    <div className="config">
      <AppHeader onBack={regresar} userName={session.nombre} userId={session.usuario} />
      <Sheet variant="module" style={{ paddingTop: 22, paddingBottom: 146, alignItems: 'flex-start' }}>
        <Titulo partes={['Mis impresoras', 'Nueva conexión']} />
        {busqueda === 'vacia' ? (
          <EmptyState icon={printError} titulo="No encontramos impresoras" texto="Revisa que tu impresora esté encendida y conectada a la red.">
            <TextLink tone="plain" icon={replay} onClick={buscar}>
              Buscar de nuevo
            </TextLink>
            <p>¿Sigue sin aparecer? Agrégala manualmente.</p>
          </EmptyState>
        ) : (
          <div className="config__contenido">
            <div className="config__seleccione">
              <p>Seleccione una impresora</p>
              {busqueda === 'buscando' && <img className="config__cargando" src={replay} alt="Buscando" width={20} height={20} />}
            </div>
            {busqueda === 'buscando' ? (
              <div className="config__placeholder" />
            ) : (
              <ListaImpresoras variant="red">
                {encontradas.map((i) => (
                  <ImpresoraOpcion key={i.nombre} nombre={i.nombre} onClick={() => setModal({ tipo: 'confirmar', impresora: i })} />
                ))}
              </ListaImpresoras>
            )}
          </div>
        )}
      </Sheet>

      <ActionBar variant="scan">
        <Button
          onClick={() => {
            setIp('');
            setIpError(false);
            setModal({ tipo: 'ip' });
          }}
        >
          Agregar manualmente
        </Button>
      </ActionBar>

      {modal?.tipo === 'confirmar' && (
        <Modal
          variant="compact"
          icon={iconConexion}
          title="Nueva conexión"
          actions={
            <>
              <CancelButton onClick={() => setModal(null)} />
              <ConfirmButton onClick={() => agregar(modal.impresora)} />
            </>
          }
        >
          <div className="config__nueva">
            <p className="config__nueva-label">Impresora</p>
            <p className="config__nueva-nombre">{modal.impresora.nombre}</p>
            <p className="config__nueva-ip">{modal.impresora.ip}</p>
          </div>
          <p className="config__texto config__texto--centro">¿Deseas agregar esta impresora a tu lista?</p>
        </Modal>
      )}

      {modal?.tipo === 'ip' && (
        <Modal
          variant="compact"
          icon={iconConexion}
          title="Nueva conexión"
          actions={
            <>
              <CancelButton onClick={() => setModal(null)} />
              <ConfirmButton disabled={!ip.trim()} onClick={validarIp} />
            </>
          }
        >
          <p className="config__texto">Ingrese la IP de la impresora</p>
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
