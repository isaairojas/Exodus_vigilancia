/**
 * Figma: "Trazado 38" (139:3546)
 * Última sincronización: 2026-10-28
 */
import dividerSvg from '../../../../assets/icons/divider.svg';

export function Divider() {
  return (
    <div style={{ position: 'relative', width: '100%', height: 0, flexShrink: 0 }}>
      <img src={dividerSvg} alt="" style={{ position: 'absolute', inset: '-0.75px 0', width: '100%', height: '1.5px' }} />
    </div>
  );
}
