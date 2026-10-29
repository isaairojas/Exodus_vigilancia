/**
 * Modales del módulo Revisión de cajas.
 * Figma: Embarque en otra paquetería 618:12192 · Caja en otro embarque 476:4921 ·
 *        Embarque finalizado 138:2557 · Menú 618:12559 / 289:2664 · Retirar embarque 275:3425 / 289:3207 ·
 *        Selección de motivo 275:3795 / 275:3986 · Finalizar entrega 628:4233 · Imprimir reporte 217:6299
 * Sin respaldo en Figma (spec ERB-45370): Paquetería no registrada, Embarque en revisión en otro dispositivo,
 *        Embarque pendiente y el comentario del motivo "Otros". Se componen con Modal, Button e InputField.
 * Última sincronización: 2026-10-29
 */
import { useEffect, useRef, useState } from 'react';
import { Button, CancelButton, ConfirmButton } from '../../design-system/components/atoms/Button/Button';
import { SelectField } from '../../design-system/components/atoms/Field/Field';
import { InputField } from '../../design-system/components/atoms/InputField/InputField';
import { CourierLogo, logoAspect } from'../../design-system/components/molecules/CourierCard/CourierCard';
import { Modal } from '../../design-system/components/organisms/Modal/Modal';
import { MAX_NOMBRE_NO_REGISTRADA, paqueteriasMock } from '../../mocks/acceso';
import { MAX_COMENTARIO_MOTIVO, MOTIVO_OTROS, motivosRetiroMock, type Caja, type Embarque } from '../../mocks/embarques';
import iconAlerta from '../../assets/icons/modal-icon-alerta.svg';
import iconFinalizado from '../../assets/icons/modal-icon-finalizado.svg';
import iconMenu from '../../assets/icons/modal-icon-menu.svg';
import iconPregunta from '../../assets/icons/modal-icon-pregunta.svg';
import iconMotivo from '../../assets/icons/modal-icon-motivo.svg';
import motivoCheck from '../../assets/icons/motivo-check.svg';
import iconImpresion from '../../assets/images/modal-icon-impresion.png';
import './RevisionModals.css';

export function ModalOtraPaqueteria({ embarque, caja, onClose }: { embarque: Embarque; caja: Caja; onClose: () => void }) {
  const paqueteria = paqueteriasMock.find((p) => p.id === embarque.paqueteriaId)!;
  return (
    <Modal icon={iconAlerta} title="Embarque en otra paquetería" actions={<CancelButton onClick={onClose} />}>
      <div className="ds-modal__card revision-modal__courier">
        <div className="revision-modal__logo-box">
          {paqueteria.logo && (
            <CourierLogo
              logo={paqueteria.logo}
              style={{ width: '100%', height: 'auto', aspectRatio: String(logoAspect(paqueteria.logo)) }}
            />
          )}
        </div>
        <div className="revision-modal__courier-info">
          <p className="revision-modal__b2">{paqueteria.clave}</p>
          <p className="revision-modal__destino">{embarque.destino}</p>
          <div className="revision-modal__caja-row">
            <p className="revision-modal__b2 revision-modal__azul">
              CAJA {caja.numero}/{embarque.cajas.length}
            </p>
            <p className="revision-modal__b1">FOLIO EMB: {embarque.folio}</p>
          </div>
        </div>
      </div>
      <p className="ds-modal__text">El embarque de la caja escaneada no corresponde a la paquetería seleccionada.</p>
    </Modal>
  );
}

export function ModalOtroEmbarque({ embarque, onClose }: { embarque: Embarque; onClose: () => void }) {
  return (
    <Modal icon={iconAlerta} title="Caja en otro embarque" actions={<CancelButton onClick={onClose} />}>
      <div className="ds-modal__card revision-modal__embarque">
        <p className="revision-modal__b1">La caja escaneada pertenece al embarque:</p>
        <div className="revision-modal__embarque-row">
          <p className="revision-modal__destino revision-modal__destino--flex">{embarque.destino}</p>
          <p className="revision-modal__b1">FOLIO EMB: {embarque.folio}</p>
        </div>
      </div>
      <p className="ds-modal__text">Finaliza el embarque actual para continuar.</p>
    </Modal>
  );
}

export function ModalEmbarqueFinalizado({ onNo, onSi }: { onNo: () => void; onSi: () => void }) {
  return (
    <Modal
      icon={iconFinalizado}
      title="Embarque finalizado"
      actions={
        <>
          <CancelButton onClick={onNo} />
          <ConfirmButton onClick={onSi} />
        </>
      }
    >
      <p className="ds-modal__text">
        {'Se han revisado todas las cajas del embarque detectado. \n\n¿Deseas seguir revisando cajas de otro embarque?'}
      </p>
    </Modal>
  );
}

interface ModalMenuProps {
  hayEmbarque: boolean;
  hayRevisados: boolean;
  onRetirar: () => void;
  onEliminarPaqueteria: () => void;
  onVerEmbarques: () => void;
  onFinalizarEntrega: () => void;
  onClose: () => void;
}

/**
 * Primer botón: con embarque en curso "Retirar embarque actual"; sin ninguna caja escaneada
 * "Eliminar paquetería" (indicación del usuario); con embarques ya revisados, "Retirar embarque
 * actual" deshabilitado (289:2664). "Ver embarques" y "Finalizar entrega" se habilitan con embarques revisados.
 */
export function ModalMenu({ hayEmbarque, hayRevisados, onRetirar, onEliminarPaqueteria, onVerEmbarques, onFinalizarEntrega, onClose }: ModalMenuProps) {
  const puedeFinalizar = hayRevisados && !hayEmbarque;
  return (
    <Modal
      variant="menu"
      icon={iconMenu}
      title="Menú"
      actions={
        <>
          {hayEmbarque || hayRevisados ? (
            <Button disabled={!hayEmbarque} onClick={onRetirar}>
              Retirar embarque actual
            </Button>
          ) : (
            <Button onClick={onEliminarPaqueteria}>Eliminar paquetería</Button>
          )}
          {/* Sin embarques finalizados no hay nada que ver (indicación del usuario) */}
          <Button disabled={!hayRevisados} onClick={onVerEmbarques}>
            Ver embarques
          </Button>
          <Button variant={puedeFinalizar ? 'danger' : 'primary'} disabled={!puedeFinalizar} onClick={onFinalizarEntrega}>
            Finalizar entrega
          </Button>
          <CancelButton onClick={onClose} />
        </>
      }
    />
  );
}

/** "conteo actual" (275:3430) para el embarque en curso; "entrega actual" (289:3207) para uno ya cerrado. */
export function ModalRetirarEmbarque({ cerrado, onNo, onSi }: { cerrado?: boolean; onNo: () => void; onSi: () => void }) {
  return (
    <Modal
      icon={iconPregunta}
      title="Retirar embarque"
      actions={
        <>
          <CancelButton onClick={onNo} />
          <ConfirmButton onClick={onSi} />
        </>
      }
    >
      <p className="ds-modal__text">
        {`¿Deseas retirar el embarque ${cerrado ? 'de la entrega' : 'del conteo'} actual?\n\nSe solicitará el motivo de esta acción.`}
      </p>
    </Modal>
  );
}

export function ModalFinalizarEntrega({ paqueteria, onNo, onSi }: { paqueteria: string; onNo: () => void; onSi: () => void }) {
  return (
    <Modal
      icon={iconPregunta}
      title="Finalizar entrega"
      actions={
        <>
          <CancelButton onClick={onNo} />
          <ConfirmButton onClick={onSi} />
        </>
      }
    >
      <p className="ds-modal__text">
        {'¿Desea finalizar la entrega de cajas para \nla paquetería '}
        <b>{paqueteria}</b>?
      </p>
    </Modal>
  );
}

export function ModalImprimirReporte({ onNo, onSi }: { onNo: () => void; onSi: () => void }) {
  return (
    <Modal
      icon={iconImpresion}
      title="Imprimir reporte"
      actions={
        <>
          <CancelButton onClick={onNo} />
          <ConfirmButton onClick={onSi} />
        </>
      }
    >
      <p className="ds-modal__text">¿Deseas imprimir el reporte para esta paquetería?</p>
    </Modal>
  );
}

export function ModalMotivo({ onNo, onSi }: { onNo: () => void; onSi: (motivo: string, comentario: string) => void }) {
  const [motivo, setMotivo] = useState('');
  const [comentario, setComentario] = useState('');
  const otros = motivo === MOTIVO_OTROS;
  const comentarioRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  // Al elegir "Otros" se abre el espacio del comentario con el teclado activo
  useEffect(() => {
    if (!otros) return;
    comentarioRef.current?.focus();
    comentarioRef.current?.scrollIntoView({ block: 'nearest' });
  }, [otros]);
  // "Otros" exige al menos un carácter que no sea espacio (FR-042)
  const valido = !!motivo && (!otros || comentario.trim().length > 0);
  return (
    <Modal
      icon={iconMotivo}
      title="Selección de motivo"
      actions={
        <>
          <CancelButton onClick={onNo} />
          <ConfirmButton disabled={!valido} onClick={() => onSi(motivo, otros ? comentario.trim() : '')} />
        </>
      }
    >
      <p className="ds-modal__text revision-modal__left">Selecciona un motivo para continuar.</p>
      <SelectField
        ariaLabel="Motivo"
        icon={<img src={motivoCheck} alt="" width={18} height={18} />}
        paddingLeft={12}
        gap={14}
        placeholder="Seleccionar una opción"
        value={motivo}
        options={motivosRetiroMock}
        onChange={setMotivo}
      />
      {otros && (
        <InputField
          ref={comentarioRef}
          multiline
          contador
          autoFocus
          ariaLabel="Comentario del motivo"
          placeholder="Describe el motivo"
          maxLength={MAX_COMENTARIO_MOTIVO}
          value={comentario}
          onChange={setComentario}
        />
      )}
    </Modal>
  );
}

/** Nombre libre de máximo 50 caracteres con el teclado activo (ERB-48101, FR-013). */
export function ModalNoRegistrada({ onNo, onSi }: { onNo: () => void; onSi: (nombre: string) => void }) {
  const [nombre, setNombre] = useState('');
  return (
    <Modal
      icon={iconPregunta}
      title="Paquetería no registrada"
      actions={
        <>
          <CancelButton onClick={onNo} />
          <ConfirmButton disabled={!nombre.trim()} onClick={() => onSi(nombre.trim())} />
        </>
      }
    >
      <p className="ds-modal__text revision-modal__left">Escribe el nombre de la paquetería.</p>
      <InputField
        autoFocus
        contador
        ariaLabel="Nombre de la paquetería"
        placeholder="Nombre de la paquetería"
        maxLength={MAX_NOMBRE_NO_REGISTRADA}
        value={nombre}
        onChange={setNombre}
      />
    </Modal>
  );
}

function TarjetaEmbarque({ embarque }: { embarque: Embarque }) {
  return (
    <div className="ds-modal__card revision-modal__embarque">
      <div className="revision-modal__embarque-row">
        <p className="revision-modal__destino revision-modal__destino--flex">{embarque.destino}</p>
        <p className="revision-modal__b1">FOLIO EMB: {embarque.folio}</p>
      </div>
    </div>
  );
}

/** El embarque está reservado por otra HH (ERB-48098, FR-036). */
export function ModalReservado({ embarque, onClose }: { embarque: Embarque; onClose: () => void }) {
  return (
    <Modal icon={iconAlerta} title="Embarque en revisión" actions={<CancelButton onClick={onClose} />}>
      <TarjetaEmbarque embarque={embarque} />
      <p className="ds-modal__text">El embarque está en revisión en otro dispositivo.</p>
    </Modal>
  );
}

/** Embarque iniciado antes de cerrar la app (ERB-48098, FR-038). */
export function ModalPendiente({ embarque, onCancelar, onContinuar }: { embarque: Embarque; onCancelar: () => void; onContinuar: () => void }) {
  return (
    <Modal
      icon={iconAlerta}
      title="Embarque pendiente"
      actions={
        <>
          <Button variant="danger" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button onClick={onContinuar}>Continuar</Button>
        </>
      }
    >
      <TarjetaEmbarque embarque={embarque} />
      <p className="ds-modal__text">
        {'Este embarque se inició y no se finalizó.\n\nSi continúas, el conteo inicia en cero y deberás escanear de nuevo todas las cajas. Si cancelas, el embarque queda libre para revisarse en otro dispositivo.'}
      </p>
    </Modal>
  );
}
