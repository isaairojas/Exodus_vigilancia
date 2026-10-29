/**
 * Figma: "Escaner codigo" (565:6616) — botón Teclado + Input
 * El escáner del dispositivo funciona como teclado (wedge): escribe la etiqueta y envía Enter.
 * El botón Teclado abre el teclado en pantalla para captura manual.
 * Última sincronización: 2026-10-28
 */
import { forwardRef, useState, type FormEvent, type RefObject } from 'react';
import teclado from '../../../../assets/icons/teclado.svg';
import './ScanBar.css';

interface ScanBarProps {
  onScan: (etiqueta: string) => void;
  maxLength: number;
}

export const ScanBar = forwardRef<HTMLInputElement, ScanBarProps>(function ScanBar({ onScan, maxLength }, ref) {
  const [valor, setValor] = useState('');
  const [manual, setManual] = useState(false);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!valor.trim()) return;
    onScan(valor);
    setValor('');
  };

  return (
    <form className="ds-scan-bar" onSubmit={enviar}>
      <button
        type="button"
        className="ds-scan-bar__keyboard"
        aria-label="Capturar etiqueta con teclado"
        aria-pressed={manual}
        onClick={() => {
          setManual(true);
          (ref as RefObject<HTMLInputElement> | null)?.current?.focus();
        }}
      >
        <img src={teclado} alt="" width={50} height={50} />
      </button>
      <input
        ref={ref}
        className="ds-scan-bar__input"
        aria-label="Etiqueta de caja"
        inputMode={manual ? 'numeric' : 'none'}
        autoComplete="off"
        maxLength={maxLength}
        value={valor}
        onChange={(e) => setValor(e.target.value.replace(/\D/g, ''))}
        onBlur={() => setManual(false)}
      />
    </form>
  );
});
