/**
 * Figma: "Notificaciones Toast Rojo" (466:4388) · "Notificaciones Toast Verde" (526:4438)
 * Última sincronización: 2026-10-28
 */
import closeIcon from '../../../../assets/icons/toast-close.svg';
import separador from '../../../../assets/icons/toast-separador.svg';
import iconError from '../../../../assets/icons/toast-icon-error.svg';
import iconExito from '../../../../assets/icons/toast-icon-exito.svg';
import './Toast.css';

export interface ToastData {
  tipo: 'error' | 'exito';
  titulo: string;
  mensaje: string;
}

export function Toast({ tipo, titulo, mensaje, onClose }: ToastData & { onClose: () => void }) {
  return (
    <div className={`ds-toast ds-toast--${tipo}`} role="status">
      <img className="ds-toast__icon" src={tipo === 'error' ? iconError : iconExito} alt="" />
      <div className="ds-toast__text">
        <p className="ds-toast__title">{titulo}</p>
        <p className="ds-toast__message">{mensaje}</p>
      </div>
      <img className="ds-toast__separator" src={separador} alt="" />
      <button type="button" className="ds-toast__close" aria-label="Cerrar" onClick={onClose}>
        <img src={closeIcon} alt="" />
      </button>
      <div className="ds-toast__bar" />
    </div>
  );
}
