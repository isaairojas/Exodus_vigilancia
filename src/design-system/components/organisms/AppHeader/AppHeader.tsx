/**
 * Figma: instancia "Header" (139:3541 con "Menú" · 530:6315 solo flecha · 565:6577 con menú ⋮)
 * Última sincronización: 2026-10-28
 */
import tasksSolid from '../../../../assets/icons/tasks-solid.svg';
import arrowBack from '../../../../assets/icons/arrow-back.svg';
import person from '../../../../assets/icons/person.svg';
import moreVert from '../../../../assets/icons/more-vert.svg';
import './AppHeader.css';

interface AppHeaderProps {
  /** Sin onBack el contenedor de la flecha queda vacío (565:6577). */
  onBack?: () => void;
  backLabel?: string;
  /** Con onMenu se muestra el botón ⋮ (Menu hamburguesa I565:6577;111:1210). */
  onMenu?: () => void;
  userName: string;
  userId: string;
}

export function AppHeader({ onBack, backLabel, onMenu, userName, userId }: AppHeaderProps) {
  return (
    <header className="ds-app-header">
      <img className="ds-app-header__watermark" src={tasksSolid} alt="" />
      <div className="ds-app-header__nav">
        {onBack ? (
          <button type="button" className="ds-app-header__back" onClick={onBack} aria-label={backLabel ? undefined : 'Atrás'}>
            <img src={arrowBack} alt="" width={20.482} height={17.923} />
            {backLabel && <span>{backLabel}</span>}
          </button>
        ) : (
          <div className="ds-app-header__back" />
        )}
        <div className="ds-app-header__user">
          <img src={person} alt="" width={40} height={40} />
          <div className="ds-app-header__user-text">
            <p className="ds-app-header__user-name">{userName}</p>
            <p>{userId}</p>
          </div>
        </div>
        <div className="ds-app-header__menu">
          {onMenu && (
            <button type="button" className="ds-app-header__menu-btn" aria-label="Menú" onClick={onMenu}>
              <img src={moreVert} alt="" width={5.474} height={22.024} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
