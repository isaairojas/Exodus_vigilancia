/**
 * Figma: "Cubito" (135:1638) — rojo pendiente / verde escaneada
 * Última sincronización: 2026-10-28
 */
import pendiente from '../../../../assets/icons/cubito-pendiente.svg';
import escaneado from '../../../../assets/icons/cubito-escaneado.svg';
import './Cubito.css';

export function Cubito({ numero, escaneada }: { numero: number; escaneada: boolean }) {
  return (
    <div className="ds-cubito" aria-label={`Caja ${numero} ${escaneada ? 'escaneada' : 'pendiente'}`}>
      <img src={escaneada ? escaneado : pendiente} alt="" />
      <span className="ds-cubito__numero">{numero}</span>
    </div>
  );
}
