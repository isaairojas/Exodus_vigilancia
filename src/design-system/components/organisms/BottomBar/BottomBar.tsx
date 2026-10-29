/**
 * Figma: "Botón salir" (13:155)
 * Última sincronización: 2026-10-28
 */
import { Button } from '../../atoms/Button/Button';
import './BottomBar.css';

export function BottomBar({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="ds-bottom-bar">
      <Button variant="danger" onClick={onClick}>
        {label}
      </Button>
    </div>
  );
}
