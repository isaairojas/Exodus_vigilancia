/**
 * Figma: "Botones" (139:3644 Revisión de cajas · 141:3647 Impresión reportes)
 * Última sincronización: 2026-10-28
 */
import './ActionTile.css';

interface ActionTileProps {
  label: string;
  icon: { src: string; left: number; top: number; width: number; height: number; blendLighten?: boolean };
  onClick?: () => void;
}

export function ActionTile({ label, icon, onClick }: ActionTileProps) {
  const content = (
    <>
      <span className="ds-action-tile__label">{label}</span>
      <img
        className="ds-action-tile__icon"
        src={icon.src}
        alt=""
        style={{
          left: icon.left,
          top: icon.top,
          width: icon.width,
          height: icon.height,
          mixBlendMode: icon.blendLighten ? 'lighten' : undefined,
        }}
      />
    </>
  );
  return onClick ? (
    <button type="button" className="ds-action-tile" onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className="ds-action-tile">{content}</div>
  );
}
