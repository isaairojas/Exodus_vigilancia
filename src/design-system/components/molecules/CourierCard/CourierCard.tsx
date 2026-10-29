/**
 * Figma: "Paquetería seleccion" (14:1235) + "Paquetería" (241:2894 / 553:4745 / 213:4922)
 * Última sincronización: 2026-10-28
 */
import type { CSSProperties } from 'react';
import type { Paqueteria } from '../../../../mocks/acceso';
import './CourierCard.css';

/** Proporción ancho/alto del logo según Figma. */
export function logoAspect(logo: NonNullable<Paqueteria['logo']>): number {
  if (logo.size) return logo.size.width / logo.size.height;
  const [w, h] = (logo.aspect ?? '1 / 1').split('/').map(Number);
  return w / h;
}

/** Logo ajustado (contain) a una caja máxima, conservando el recorte de Figma. */
export function CourierLogoFit({ logo, maxWidth, maxHeight }: { logo: NonNullable<Paqueteria['logo']>; maxWidth: number; maxHeight: number }) {
  const a = logoAspect(logo);
  const height = Math.min(maxHeight, maxWidth / a);
  return <CourierLogo logo={logo} style={{ width: height * a, height }} />;
}

export function CourierLogo({ logo, style }: { logo: NonNullable<Paqueteria['logo']>; style?: CSSProperties }) {
  const box: CSSProperties = logo.size
    ? { width: logo.size.width, height: logo.size.height }
    : { width: '100%', aspectRatio: logo.aspect };
  return (
    <div className="ds-courier-logo" style={{ ...box, ...style }}>
      <img
        src={logo.src}
        alt=""
        className={logo.crop ? 'ds-courier-logo__img--crop' : 'ds-courier-logo__img--cover'}
        style={logo.crop}
      />
    </div>
  );
}

interface CourierCardProps {
  paqueteria: Paqueteria;
  width?: number;
  onSelect: (p: Paqueteria) => void;
}

export function CourierCard({ paqueteria, width = 198, onSelect }: CourierCardProps) {
  return (
    <button type="button" className="ds-courier-card" style={{ width }} onClick={() => onSelect(paqueteria)}>
      <div className={`ds-courier-card__body${paqueteria.logo ? '' : ' ds-courier-card__body--text'}`}>
        {paqueteria.logo && (
          <div className="ds-courier-card__logo-area">
            <CourierLogo logo={paqueteria.logo} />
          </div>
        )}
        <p className="ds-courier-card__name">{paqueteria.nombre}</p>
      </div>
    </button>
  );
}
