/**
 * Figma: "Menú"
 * nodeId: 13:133
 * + engrane de Configuraciones (730:5227, sección 730:5223)
 * "Revisión paqueterías" solo con el rol Vigilancia (ERB-48103)
 * URL: https://www.figma.com/design/GWE1jyD5ZyUbvLUsk6pVkx/?node-id=13-133
 * Última sincronización: 2026-10-29
 */
import { useNavigate } from 'react-router-dom';
import { MenuCard } from '../../design-system/components/molecules/MenuCard/MenuCard';
import { BottomBar } from '../../design-system/components/organisms/BottomBar/BottomBar';
import { ROL_VIGILANCIA } from '../../mocks/acceso';
import { useRegresar } from '../../navigation/botones';
import { useSession } from '../../navigation/session';
import settings from '../../assets/icons/settings.svg';
import iconPackage from '../../assets/icons/menu-package.svg';
import iconBarcode from '../../assets/icons/menu-barcode.svg';
import iconShipping from '../../assets/icons/menu-shipping.svg';
import iconPrint from '../../assets/icons/menu-print.svg';
import './Menu.css';

export function Menu() {
  const navigate = useNavigate();
  const session = useSession();
  // Menú principal: Regresar no sale de la sesión (FR-100: siempre a la ventana anterior, y no hay anterior)
  useRegresar(() => {});

  return (
    <div className="menu">
      <div className="menu__header">
        <p className="menu__title">Menú</p>
        <button type="button" className="menu__config" aria-label="Configuraciones" onClick={() => navigate('/configuracion')}>
          <img src={settings} alt="" width={27.2} height={28} />
        </button>
      </div>
      <div className="menu__scroll">
        <div className="menu__list">
          <MenuCard label={'Surtido de \nmercancía'} icon={iconPackage} tone="primary" />
          <MenuCard label={'Etiquetas\nCross-docking'} icon={iconBarcode} tone="alt" />
          {session.roles.includes(ROL_VIGILANCIA) && (
            <MenuCard
              label="Revisión paqueterías"
              icon={iconShipping}
              tone="primary"
              onClick={() => navigate('/acceso/revision-paqueterias')}
            />
          )}
          <MenuCard
            label={'Configuración\nde impresoras'}
            icon={iconPrint}
            tone="alt"
            last
            onClick={() => navigate('/configuracion/impresion')}
          />
        </div>
      </div>
      <BottomBar
        label="Salir"
        onClick={() => {
          session.cerrar();
          navigate('/acceso/inicio-sesion');
        }}
      />
    </div>
  );
}
